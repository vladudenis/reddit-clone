import { gql } from '@apollo/client'

export const GET_ALL_POSTS = gql`
  query MyQUery {
    getPostList {
      body
      created_at
      id
      image
      title
      subreddit_id
      username
      comment {
        id
        post_id
        created_at
        text
        username
      }
      subreddit {
        id
        created_at
        topic
      }
      vote {
        id
        post_id
        created_at
        upvote
        username
      }
    }
  }
`

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      created_at
      id
      image
      title
      subreddit_id
      username
      comment {
        id
        post_id
        created_at
        text
        username
      }
      subreddit {
        id
        created_at
        topic
      }
      vote {
        id
        post_id
        created_at
        upvote
        username
      }
    }
  }
`

export const GET_POST_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getPostByPostId(post_id: $post_id) {
      body
      created_at
      id
      image
      title
      subreddit_id
      username
      comment {
        id
        post_id
        created_at
        text
        username
      }
      subreddit {
        id
        created_at
        topic
      }
      vote {
        id
        post_id
        created_at
        upvote
        username
      }
    }
  }
`

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`

export const GET_SUBREDDIT_LIST_WITH_LIMIT = gql`
  query MyQuery($limit: Int!) {
    getSubredditListLimit(limit: $limit) {
      created_at
      id
      topic
    }
  }
`

export const GET_VOTE_LIST_BY_ID = gql`
  query MyQuery($post_id: ID!) {
    getVoteListById(post_id: $post_id) {
      created_at
      id
      post_id
      upvote
      username
    }
  }
`
