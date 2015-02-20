import java.util.ArrayList;
import java.util.List;

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