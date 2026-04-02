import { prisma } from "@/server/core/prisma";
import type { CreatePostInput, UpdatePostInput } from "./posts.schema";

export async function getPostsByAuthor(authorId: string) {
  return prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostById(id: string, authorId: string) {
  return prisma.post.findFirst({
    where: { id, authorId },
  });
}

export async function createPost(input: CreatePostInput, authorId: string) {
  return prisma.post.create({
    data: { ...input, authorId },
  });
}

export async function updatePost(id: string, input: UpdatePostInput, authorId: string) {
  return prisma.post.update({
    where: { id, authorId },
    data: input,
  });
}

export async function deletePost(id: string, authorId: string) {
  return prisma.post.delete({
    where: { id, authorId },
  });
}
