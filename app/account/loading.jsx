import { Spinner } from '@nextui-org/react';

export default async function Loading() {
  return (
    <div className="flex justify-center items-center h-72">
      <div className="text-3xl flex flex-col gap-4">
        Loading...
        <Spinner size="large" />
      </div>
    </div>
  );
}
