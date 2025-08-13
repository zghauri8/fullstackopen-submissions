import React from 'react'

interface CoursePartBase {
name: string;
exerciseCount: number;
}

interface DescribedPart extends CoursePartBase {
description: string;
}

interface CoursePartBasic extends DescribedPart {
kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
groupProjectCount: number;
kind: "group";
}

interface CoursePartBackground extends DescribedPart {
backgroundMaterial: string;
kind: "background";
}

interface CoursePartSpecial extends DescribedPart {
requirements: string[];
kind: "special";
}

export type CoursePart =
| CoursePartBasic
| CoursePartGroup
| CoursePartBackground
| CoursePartSpecial;

const assertNever = (value: never): never => {
throw new Error(`Unhandled course part: ${JSON.stringify(value)}`);
};

const Part: React.FC<{ part: CoursePart }> = ({ part }) => {
switch (part.kind) {
case 'basic':
return <p><strong>{part.name}</strong> {part.exerciseCount} <em>{part.description}</em></p>;
case 'group':
return <p><strong>{part.name}</strong> {part.exerciseCount} group projects {part.groupProjectCount}</p>;
case 'background':
return <p><strong>{part.name}</strong> {part.exerciseCount} <em>{part.description}</em> bg: {part.backgroundMaterial}</p>;
case 'special':
return <p><strong>{part.name}</strong> {part.exerciseCount} <em>{part.description}</em> req: {part.requirements.join(', ')}</p>;
default:
return assertNever(part);
}
};

export default Part;