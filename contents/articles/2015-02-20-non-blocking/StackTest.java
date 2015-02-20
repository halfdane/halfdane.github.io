import static java.lang.String.format;

import static org.testng.AssertJUnit.assertSame;

import java.util.ArrayList;
import java.util.concurrent.CountDownLatch;

import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class StackTest {


    @DataProvider
    public Object[][] stacks() {
        return new Object[][] { {new BlockingStack<>()}, {new NonBlockingStack<>()}};
    }

    @Test(dataProvider = "stacks")
    public void shouldPushAndPop(final Stack<Integer> stack) {
        // given

        // when
        stack.push(3);
        stack.push(4);
        stack.push(5);

        // then
        assertSame(stack.pop(), 5);
        assertSame(stack.pop(), 4);
        assertSame(stack.pop(), 3);
        assertSame(stack.pop(), null);
        assertSame(stack.pop(), null);
    }

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
        final CountDownLatch synchStart = new CountDownLatch(1);
        final CountDownLatch synchEnd = new CountDownLatch(threadCount);

        final ArrayList<StackingThread> threads = new ArrayList<>();
        for (int i = 0; i < threadCount; i++) {
            final StackingThread stackingThread = new StackingThread(stack, count, synchStart, synchEnd);
            threads.add(stackingThread);
            stackingThread.start();
        }

        final long start = System.nanoTime();
        synchStart.countDown();
        synchEnd.await();
        final long stop = System.nanoTime();

        return stop - start;
    }

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
                synchStart.await();
            } catch (final InterruptedException e) {
                throw new RuntimeException(e);
            }
            for (int i = 0; i < count; i++) {
                stack.push(1);
                Thread.yield();
            }
            for (int i = 0; i < count; i++) {
                stack.pop();
                Thread.yield();
            }
            synchEnd.countDown();
        }
    }

}