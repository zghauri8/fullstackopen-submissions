import Part from './Part';
import type { CoursePart } from './Part';

const Content = ({ parts }: { parts: CoursePart[] }) => (

<div> {parts.map((p, i) => <Part key={i} part={p} />)} </div> ); export default Content;