import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { invalidateQuery } from "@/lib/query-client";

export const postsKeys = {
  all: ["posts"],
  detail: (id: string) => ["posts", id],
} as const;


export function usePosts() {
  return useQuery({
    queryKey: postsKeys.all,
    queryFn: async () => {
      const res = await apiClient.api.posts.$get();
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.api.posts[":id"].$get({ param: { id } });
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  return useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await apiClient.api.posts.$post({ json: data });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: () => invalidateQuery(postsKeys.all),
  });
}

export function useUpdatePost() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; content?: string };
    }) => {
      const res = await apiClient.api.posts[":id"].$patch({
        param: { id },
        json: data,
      } as Parameters<(typeof apiClient.api.posts)[":id"]["$patch"]>[0]);
      if (!res.ok) throw new Error("Failed to update post");
      return res.json();
    },
    onSuccess: () => invalidateQuery(postsKeys.all),
  });
}

export function useDeletePost() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.api.posts[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
  });
}
