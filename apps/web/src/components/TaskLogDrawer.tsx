import React from 'react';

const TaskLogDrawer: React.FC<{ logs: any[] }> = ({ logs }) => {
  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-gray-800 p-4 overflow-y-auto shadow-lg">
      <h2 className="text-xl font-bold mb-4">Task Log</h2>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx} className="mb-2 p-2 bg-gray-700 rounded">
            <pre>{JSON.stringify(log, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskLogDrawer;
