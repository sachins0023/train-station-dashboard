export class MinHeap<T> {
  private heap: T[];
  private compare: (a: T, b: T) => number;

  constructor(compareFn: (a: T, b: T) => number) {
    this.compare = compareFn;
    this.heap = [];
  }

  push(val: T): void {
    this.heap.push(val);
    this._bubbleUp();
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0 && bottom !== undefined) {
      this.heap[0] = bottom;
      this._sinkDown();
    }
    return top;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  _bubbleUp(): void {
    let idx = this.heap.length - 1;
    const element = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      if (this.compare(element, parent) >= 0) break;
      this.heap[parentIdx] = element;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
  }

  _sinkDown(): void {
    let idx = 0;
    const length = this.heap.length;
    const element = this.heap[0];
    while (true) {
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      let swap: number | null = null;

      if (leftIdx < length) {
        const left = this.heap[leftIdx];
        if (this.compare(left, element) < 0) swap = leftIdx;
      }

      if (rightIdx < length) {
        const right = this.heap[rightIdx];
        if (
          (swap === null && this.compare(right, element) < 0) ||
          (swap !== null && this.compare(right, this.heap[swap]) < 0)
        ) {
          swap = rightIdx;
        }
      }

      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      this.heap[swap] = element;
      idx = swap;
    }
  }

  size() {
    return this.heap.length;
  }
}
