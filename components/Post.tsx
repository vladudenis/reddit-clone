import React, { useEffect, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotsHorizontalIcon,
} from '@heroicons/react/solid'
import {
  BookmarkIcon,
  ChatAltIcon,
  GiftIcon,
  ShareIcon,
} from '@heroicons/react/outline'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useMutation, useQuery } from '@apollo/client'
import { GET_VOTE_LIST_BY_ID } from '../graphql/queries'
import { ADD_VOTE } from '../graphql/mutations'

type Props = {
  post: Post
}

export default function Post({ post }: Props) {
  // This is defensive programming which can be replaced by SSR thanks to Next.js
  if (!post) {
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="red" />
      </div>
    )
  }

  const { data: session } = useSession()
  const [vote, setVote] = useState<boolean>()

  const { data, loading } = useQuery(GET_VOTE_LIST_BY_ID, {
    variables: { post_id: post.id },
  })
  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_VOTE_LIST_BY_ID, 'getVoteListById'],
  })

  useEffect(() => {
    const votes: Vote[] = data?.getVoteListById
    const vote = votes?.find((v) => v.username === session?.user?.name)?.upvote

    setVote(vote)
  }, [data])

  const upVote = async (isUpVote: boolean) => {
    if (!session) {
      toast('You need to sign in before you can vote!')
      return
    }

    if (vote && isUpVote) return
    if (vote === false && !isUpVote) return

    const notification = toast.loading('Voting...')

    await addVote({
      variables: {
        post_id: post.id,
        username: session?.user?.name,
        upvote: isUpVote,
      },
    })

    toast.success('Vote was successful!', { id: notification })
  }

  const displayVotes = (data: any): number => {
    const votes: Vote[] = data?.getVoteListById

    if (votes?.length === 0) return 0

    const displayNumber = votes?.reduce(
      (total, v) => (v.upvote ? (total += 1) : (total -= 1)),
      0
    )

    if (displayNumber === 0) return votes[0]?.upvote ? 1 : -1

    return displayNumber
  }

  return (
    <Link href={`/post/${post.id}`} passHref>
      <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-600">
        {/* Votes Sidebar */}
        <div className="rounded- flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
          <ArrowUpIcon
            onClick={() => upVote(true)}
            className={`voteButton hover:text-blue-400 ${
              vote && 'text-blue-400'
            }`}
          />
          <p className="text-xs font-bold text-black">{displayVotes(data)}</p>
          <ArrowDownIcon
            onClick={() => upVote(false)}
            className={`voteButton hover:text-red-400 ${
              vote === false && 'text-red-400'
            }`}
          />
        </div>

        <div className="p-3 pb-1">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar seed={post.username} />
            <p className="text-xs text-gray-400 ">
              <Link href={`/subreddit/${post.subreddit[0]?.topic}`} passHref>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post.subreddit[0]?.topic}
                </span>
              </Link>
              {'  '}• Posted by u/r/{post.username}{' '}
              <TimeAgo date={post.created_at} />
            </p>
          </div>

          {/* Body */}
          <div className="py-4 ">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>

          {/* Image */}
          {post.image && (
            <img className="w-full" src={post.image} alt="Attached Image" />
          )}

          {/* Footer */}
          <div className="flex space-x-4 text-gray-400 ">
            <div className="postButton">
              <ChatAltIcon className="h-6 w-6" />
              <p className="">{post.comment.length} Comments</p>
            </div>
            <div className="postButton">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButton">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButton">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButton">
              <DotsHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
