import java.util.concurrent.atomic.AtomicReference;

public class NonBlockingStack<E> implements Stack<E> {
    AtomicReference<Node<E>> head = new AtomicReference<Node<E>>();

    @Override
    public void push(final E item) {
        final Node<E> newHead = new Node<E>(item);
        Node<E> oldHead;
        do {
            oldHead = head.get();
            newHead.next = oldHead;
        } while (!head.compareAndSet(oldHead, newHead));
    }

    @Override
    public E pop() {
        Node<E> oldHead;
        Node<E> newHead;
        do {
            oldHead = head.get();
            if (oldHead == null)
                return null;
            newHead = oldHead.next;
        } while (!head.compareAndSet(oldHead,newHead));
        return oldHead.item;
    }


    public class Node<I> {
        I item;
        Node<I> next;

        public Node(final I item) {
            this.item = item;
        }
    }

}
