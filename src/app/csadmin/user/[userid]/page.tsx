import { notFound, redirect } from "next/navigation";

type UserDetailPageProps = {
  params: Promise<{ userid: string }>;
};

const isValidUserId = (value: string) => {
  if (!/^\d+$/.test(value)) return false;
  const userId = Number(value);
  return Number.isSafeInteger(userId) && userId > 0;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { userid } = await params;

  if (!isValidUserId(userid)) {
    notFound();
  }

  redirect(`/csadmin/user/${userid}/post`);
}
