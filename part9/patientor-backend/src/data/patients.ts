import { Patient, Gender } from '../types';
const patients: Patient[] = [
{
id: 'd2773336-f723-11e9-8f0b-362b9e155667',
name: 'John McClane',
dateOfBirth: '1986-07-09',
ssn: '090786-122X',
gender: Gender.Male,
occupation: 'New york city cop',
entries: []
},
{
id: 'd2773598-f723-11e9-8f0b-362b9e155667',
name: 'Jane Doe',
dateOfBirth: '1979-01-01',
ssn: '010179-121A',
gender: Gender.Female,
occupation: 'Engineer',
entries: []
}
];

export default patients;