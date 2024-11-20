import { unstable_cache } from 'next/cache'
import prisma from '@/lib/prisma'

const getPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany()
  },
  ['posts'],
  { tags: ['posts'] }
)

export default async function Page() {
const allPosts = await getPosts()
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {allPosts.map((post) => (
          <li key={post.id}>
            <a href={`/posts/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}