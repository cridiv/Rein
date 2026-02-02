import React from "react";
import Dashboard from "./Dashboard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  return <Dashboard id={id} />;
};

export default page;