import { useQuery } from '@tanstack/react-query'

const fetchPosts = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json() // this returns an array of posts
}

const Posts = () => {
  const queryKey = ['posts']
  const queryFn = fetchPosts

  // You can log them here BEFORE calling useQuery
  console.log('queryKey:', queryKey)
  console.log('queryFn:', queryFn)

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn,
  })

  if (isLoading) return <div>Loading posts...</div>
  if (error) return <div>Error fetching posts</div>

  console.log('posts', data)

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data?.map((post: any) => (
          <li key={post.id}>{post.title}</li> // show each post title
        ))}
      </ul>
    </div>
  )
}

export default Posts
