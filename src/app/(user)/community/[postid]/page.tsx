import CommunityPost from "@/features/community/components/PostDetail/CommunityPost";

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
