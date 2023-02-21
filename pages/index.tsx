import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { User } from "domain/type/user";
import { Post } from "domain/type/post";
import { Comment } from "domain/type/comment";

import { ProgressSpinner } from "../components";
import useFetchData from "hooks/useFetchData";
import { FetchResult } from "domain/interface/fetch";

export default function Home() {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [displayPostNumber, setDisplayPostNumber] = useState<number>(3);
  const {
    data: users,
    isLoading: isUsersLoading,
    fetchData: fetchUsers,
  }: FetchResult<User[]> = useFetchData<User[]>([]);
  const {
    data: posts,
    isLoading: isPostsLoading,
    fetchData: fetchPosts,
  } = useFetchData<Post[]>([]);
  const {
    data: comments,
    isLoading: isCommentsLoading,
    fetchData: fetchComments,
  } = useFetchData<Comment[]>([]);

  useEffect(() => {
    fetchUsers("https://jsonplaceholder.typicode.com/users");
  }, []);

  useEffect(() => {
    if (activeUser) {
      fetchPosts(
        `https://jsonplaceholder.typicode.com/posts?userId=${activeUser.id}`
      );
    }
  }, [activeUser]);

  const expandPost = async (postId: number) => {
    await fetchComments(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    );
  };

  const filteredPosts = useMemo(() => {
    if (activeUser) {
      return posts
        ?.filter((post) => post.userId === activeUser.id)
        .slice(0, displayPostNumber);
    }
    return [];
  }, [activeUser, posts, displayPostNumber]);

  useEffect(() => {
    setDisplayPostNumber(3);
  }, [activeUser]);

  return (
    <>
      <Head>
        <title>User Post Viewer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-5 container mx-auto">
        <h1 className="text-3xl font-bold mb-5">User Post Viewer</h1>
        <div className="mb-5">
          <h2 className="text-xl font-bold mb-2">
            Please select a user to find their posts
          </h2>
          <div className="flex flex-wrap ">
            {users?.map((user) => {
              return (
                <button
                  role="user-button"
                  key={user.id}
                  className={` font-semibold py-2 px-4 rounded-lg mr-2 mb-2 ${
                    user.id === activeUser?.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                  onClick={() => setActiveUser(user)}
                >
                  {user.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
        {activeUser && (
          <div>
            <h2 className="text-xl font-bold mb-2">
              {activeUser.name}'s posts
            </h2>
            <div className="max-w-xl mx-auto">
              {filteredPosts?.map((post) => {
                return (
                  <div key={post.id} className="flex items-center">
                    <div className="bg-gray-100 p-4 mb-2 rounded-lg basis-5/6">
                      <h3 className="text-lg font-bold mb-1 text-black">
                        {post.title}
                      </h3>
                      <p className="text-gray-700">{post.body}</p>

                      {comments?.map((comment) => {
                        if (comment.postId === post.id) {
                          return (
                            <div
                              key={comment.id}
                              className="bg-gray-50 p-2 mt-2 rounded-lg"
                            >
                              <p className="text-gray-700 font-medium">
                                {comment.email}
                              </p>
                              <p className="text-gray-600">{comment.body}</p>
                            </div>
                          );
                        }
                      })}
                    </div>
                    <div className="basis-1/6 text-center">
                      {filteredPosts &&
                        !filteredPosts.some(
                          (filteredPost) =>
                            filteredPost.id === post.id &&
                            comments?.some(
                              (comment) => comment.postId === post.id
                            )
                        ) && (
                          <button
                            className="inline-flex items-center p-2 text-sm font-medium text-white border border-white rounded-full hover:bg-blue-600 hover:border-blue-600"
                            onClick={() => expandPost(post.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
              {posts?.length &&
              posts?.length > 3 &&
              displayPostNumber !== posts.length ? (
                <div className="flex">
                  <div className="basis-5/6  text-right">
                    <button
                      className=" border px-4 py-1 text-sm font-medium text-gray-200 rounded-lg hover:bg-gray-300 hover:text-gray-700"
                      onClick={() => {
                        setDisplayPostNumber(posts.length);
                      }}
                    >
                      Load all
                    </button>
                  </div>
                  <div className="basis-1/6"></div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
      {isUsersLoading || isCommentsLoading || isPostsLoading ? (
        <div className={`fixed inset-0 z-50  `}>
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
          <div className="flex items-center justify-center h-full">
            <ProgressSpinner size={4} />
          </div>
        </div>
      ) : null}
    </>
  );
}
