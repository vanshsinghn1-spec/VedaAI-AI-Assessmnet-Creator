'use client';

import { Assignment } from '@/types';
import AssignmentCard from './AssignmentCard';

interface AssignmentGridProps {
  assignments: Assignment[];
}

export default function AssignmentGrid({ assignments }: AssignmentGridProps) {
  return (
    <div className="assignments-grid">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment._id} assignment={assignment} />
      ))}
    </div>
  );
}
