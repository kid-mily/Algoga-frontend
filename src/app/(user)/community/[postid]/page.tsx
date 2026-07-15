import CommunityPostDetail from "@/features/community/components/PostDetail/CommunityPostDetail";

type CommunityPostDetailPageProps = {
  params: Promise<{
    postid: string;
  }>;
};

export default async function CommunityPostDetailPage({
  params,
}: CommunityPostDetailPageProps) {
  const { postid } = await params;

  return <CommunityPostDetail postId={Number(postid)} />;
}
