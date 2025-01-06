import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-3xl flex flex-col gap-4">
        Loading...
        <Spinner size="large" />
      </div>
    </div>
  );
}
