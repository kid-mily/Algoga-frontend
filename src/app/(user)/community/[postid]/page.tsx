import CommunityPost from "@/features/community/components/CommunityPost";

type CommunityPostDetailPageProps = {
  params: Promise<{
    postid: string;
  }>;
};

export default async function CommunityPostDetailPage({
  params,
}: CommunityPostDetailPageProps) {
  const { postid } = await params;

  return <CommunityPost postId={Number(postid)} />;
}
