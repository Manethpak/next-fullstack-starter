"use client";

import { usePosts } from "@/features/posts/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PostList() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) {
    return <p className="text-muted-foreground">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-destructive">Failed to load posts</p>;
  }

  if (!posts || posts.length === 0) {
    return <p className="text-muted-foreground">No posts yet</p>;
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>{new Date(post.createdAt).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
