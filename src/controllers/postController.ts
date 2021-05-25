import { handleNotFound, handleError } from "../helpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  const { limit = 10, page = 1, sortOrder = "asc", author, title } = req.query;

  try {
    const posts = await prisma.post.findMany({
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        id: sortOrder,
      },
      where: {
        author: {
          username: author,
        },
        title: {
          contains: title,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    const collectedPosts = posts.map((post) => ({
      ...post,
      postLength: post.content.length,
    }));
    const result = {
      count: collectedPosts.length,
      data: collectedPosts,
    };
    res.json(result);
  } catch (error) {
    handleError(error.message, res);
  }
};

export const getFeed = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    const result = {
      count: posts.length,
      data: posts,
    };
    res.json(result);
  } catch (error) {
    handleError(error.message, res);
  }
};

export const createPost = async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            username: author,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    res.json(post);
  } catch (error) {
    handleError(error.message, res);
  }
};

export const getOnePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    res.json(post);
  } catch (error) {
    handleNotFound(error.message, res);
  }
};

export const publishPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { published: true },
    });
    res.json(post);
  } catch (error) {
    handleNotFound(error.message, res);
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  console.log(req.body);
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: params,
    });
    res.json(post);
  } catch (error) {
    handleNotFound(error.message, res);
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    res.json(post);
  } catch (error) {
    handleNotFound(error.message, res);
  }
};
