---
title: "Non-Blocking Stack in Java"
image: Kolejka.jpg
---
Um den Performance-Hit von `synchronized` zu vermeiden, kann man dank Compare-And-Set (bzw. der Java-Implementierung als `Atomic*`) auch Non-Blocking Algorithmen benutzen.

|image|Kolejka.jpg|Jump the waiting queue with non-blocking algorithms|
    Jump the waiting queue with non-blocking algorithms ([Wikipedia](http://en.wikipedia.org/wiki/Queue_area)).|

Die einfachste Variante des Stack-Interfaces:

```java
public interface Stack<I> {
    /*lege ein item oben auf den Stack*/
    void push(I item);

    /*hole das oberste item vom Stack zurück*/
    I pop();
}
```

Eine naive Implementierung dieses Interfaces mit einer ArrayList kann z.B. so aussehen:
 
```java
public class BlockingStack<I> implements Stack<I> {

    private int top = -1;
    private final List<I> storage = new ArrayList<>();

    public synchronized void push(final I value) {
        top++;
        storage.add(top, value);
    }

    public synchronized I pop() {
        if (top < 0) {
            return null;
        }

        final I item = storage.get(top);
        top--;
        return item;
    }
}
```

Man beachte dabei insbesondere das `synchronized`-Keyword, das verhindert, dass mehrere Threads gleichzeitig den so geschützten Codeblock durchlaufen.
Jeder Thread muss davor warten und darf erst durch, wenn er an der Reihe ist.

Bei massiv parallelen Anwendungen können sich solche Bereiche als Performance-Problem herausstellen. 
Ein Bottleneck wird der geschützte Bereich insbesondere, wenn viele Threads gleichzeitig durch "diese hohle Gasse" kommen müssen. 

In solchen Situationen kann es sich lohnen, den Implementierungsaufwand eines Non-Blocking-Algorithmus in Betracht zu ziehen.
Im Wesentlichen benutzt diese Klasse von Algorithmen eine Optimistic-Locking-Strategie: der neue Wert wird nur dann gesetzt, wenn der alte sich inzwischen nicht geändert hat.
Man benötigt also immer beide: den ursprünglichen und den neuen Wert.

Falls der Wert sich zwischenzeitlich aber doch geändert hat, wird die Berechnung mit dem aktuellen Wert wiederholt, 
bis der neue Wert erfolgreich gesetzt wurde. Hier ein Ausschnitt, der die Push-Methode und die Container-Klasse zeigt:  

```java
    public void push(final E item) {
        final Node<E> newHead = new Node<E>(item);
        Node<E> oldHead;
        do {
            oldHead = head.get();
            newHead.next = oldHead;
        } while (!head.compareAndSet(oldHead, newHead));
    }
    
    public class Node<I> {
        I item;
        Node<I> next;

        public Node(final I item) {
            this.item = item;
        }
    }
```

Um zu schauen, ab wann sich das lohnt, habe ich vom [DeveloperWorks-Blog](http://www.ibm.com/developerworks/library/j-jtp04186/) 
die non-blocking Stack-Implementierung geklaut und in einem Multithreading-Test neben eine blockierende Implementierung gestellt.

Nach ersten simplen Tests scheint sich zu bestätigen, dass man erstmal die Anzahl konkurrierender Threads so weit hochdrehen muss,
dass sie sich gegenseitig auf den Füßen herumstehen: erst so ab tausend gleichzeitigen Threads wird der NonBlocking-Thread erheblich effizienter.

Um sicherzustellen, dass die Threads auch wirklich alle gleichzeitig loslaufen, benutze ich CountDownLatches:

```java
    @Test
    public void shouldSupportMultithreadedPush() throws InterruptedException {
        // given
        final int count = 100;
        final int threadCount = 1000;

        // when
        final long timingBlocking = getTimingFor(new BlockingStack<>(), count, threadCount);
        final long timingNonBlocking = getTimingFor(new NonBlockingStack<>(), count, threadCount);

        // then: well, nothing really
        System.out.println(format("   Blocking: \t%d", timingBlocking));
        System.out.println(format("NonBlocking: \t%d", timingNonBlocking));
    }

    private long getTimingFor(final Stack<Integer> stack, final int count, final int threadCount)
            throws InterruptedException {
            
        /*Alle Worker-Threads warten darauf, dass synchStart 0 wird, bevor es losgeht*/
        final CountDownLatch synchStart = new CountDownLatch(1);
        
        /*Alle Worker-Threads zählen synchEnd runter, sodass in diesem Thread darauf gewartet werden kann*/
        final CountDownLatch synchEnd = new CountDownLatch(threadCount);

        /*Erzeuge viiieele Worker-Threads ... */
        final ArrayList<StackingThread> threads = new ArrayList<>();
        for (int i = 0; i < threadCount; i++) {
            final StackingThread stackingThread = new StackingThread(stack, count, synchStart, synchEnd);
            threads.add(stackingThread);
            /*... die auch alle gleich loslaufen - und erstmal auf den synchStart-latch warten */
            stackingThread.start();
        }

        final long start = System.nanoTime();
        
        /*der startschuss:*/
        synchStart.countDown();
        /*warte darauf, dass alle Threads diesen Latch bis auf 0 herunterzählen*/
        synchEnd.await();
        
        final long stop = System.nanoTime();

        return stop - start;
    }

    /**Um Thread-contention zu testen, braucht man insbesondere auch Threads.*/
    private static final class StackingThread extends Thread {
        private final Stack<Integer> stack;
        private final int count;
        private final CountDownLatch synchStart;
        private final CountDownLatch synchEnd;

        private StackingThread(final Stack<Integer> stack,
                               final int count,
                               final CountDownLatch synchStart,
                               final CountDownLatch synchEnd) {
            this.stack = stack;
            this.count = count;
            this.synchStart = synchStart;
            this.synchEnd = synchEnd;
        }

        public void run() {
            try {
                /*await blockiert, bis der Wert des latches 0 ist.
                 *so laufen alle Threads gleichzeitig los */
                synchStart.await();
            } catch (final InterruptedException e) {
                throw new RuntimeException(e);
            }
            
            /*ein bisschen was mit dem stack machen*/
            for (int i = 0; i < count; i++) {
                stack.push(1);
                Thread.yield();
            }
            /*noch ein bisschen mehr*/
            for (int i = 0; i < count; i++) {
                stack.pop();
                Thread.yield();
            }
            
            /*und den anderen latch herunterzählen, auf den der main-Thread wartet.*/
            synchEnd.countDown();
        }
    }
```

Offensichtlich ist der Test nur ein lahmer Versuch, einfach mal irgendwas zu machen, und berücksichtigt in keinster Weise die
Code-Optimierungen des Just-In-Time-Compilers oder das Laufzeitverhalten von modernen CPUs, aber das ist mir egal :P

Um den Test nachzuvollziehen, kannst du hier den Source-Code benutzen:
- [Stack.java](Stack.java) (gemeinsames Interface)
- [BlockingStack.java](BlockingStack.java) (Implementierung mit `synchronized`)
- [NonBlockingStack.java](NonBlockingStack.java) (Implementierung mit `Atomic*`)
- [StackTest.java](StackTest.java) (Multithreaded-Test)

