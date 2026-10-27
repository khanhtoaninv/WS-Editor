// Chặn lỗi của một phần giao diện: không để cả app trắng (React gỡ cả cây khi một component ném lỗi).
// Lỗi vẫn ghi ra console để test (0 lỗi console) bắt được.
import { Component, type ReactNode } from 'react';

export class Guard extends Component<{ name: string; children: ReactNode }, { err: unknown }> {
  state = { err: null as unknown };
  static getDerivedStateFromError(err: unknown) { return { err }; }
  componentDidCatch(err: unknown) { console.error(`[${this.props.name}]`, err); }
  componentDidUpdate(prev: { children: ReactNode }) { if (this.state.err && prev.children !== this.props.children) this.setState({ err: null }); }
  render() { return this.state.err ? null : this.props.children; }
}
