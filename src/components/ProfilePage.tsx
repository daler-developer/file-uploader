import { collection, getDocs } from '@firebase/firestore'
import Layout from './Layout'
import Post from './Post'
import { db } from 'firebase'
import { FirestorePost } from 'firebase/documentTypes'
import { useEffect, useState } from 'react'
import { postsActions, ReduxPost, selectPosts } from 'redux/reducers/postsReducer'
import { useAppDispatch, useAppSelector } from 'utils/hooks'
import { commonActions } from 'redux/reducers/commonReducer'




type Props = {

}

export default  ({}: Props) => {
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const posts = useAppSelector((state) => selectPosts(state))

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      
      const snapshot = await getDocs(collection(db, 'posts'))

      const posts: ReduxPost[] = []

      snapshot.forEach((doc) => {
        const data = doc.data() as FirestorePost
        posts.push({
          id: doc.id,
          ...data
        })
      })

      dispatch(postsActions.setPosts(posts))
    } catch {
      dispatch(commonActions.openAlert({ type: 'error', text: 'Cannot load' }))
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredPosts = () => {
    return posts.filter((post) => {
      if (post.desc.includes(searchInputValue)) {
        return true
      }
    })
  }

  const handleReloadBtnClick = () => {
    loadPosts()
  }

  const handleAddPostBtn = () => {
    dispatch(commonActions.setCurrentVisibleModal('add-post'))
  }

  return <>
    <Layout classes={{ root: 'profile-page' }}>
      
      <div className="profile-page__top-bar">

        <div className="profile-page__search-input-wrapper">
          <span className="profile-page__icon profile-page__search-icon material-icons-outlined">
            search
          </span>
          <input
            type="text"
            className="profile-page__search-input"
            placeholder="Search image by desc..."
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
          />
        </div>

        <button className="profile-page__filter-btn">
          <span className="profile-page__icon material-icons-outlined">
            auto_awesome_mosaic
          </span>
          Filter
        </button>

        <button className="profile-page__add-post-btn" onClick={handleAddPostBtn}>
          <span className="profile-page__icon material-icons-outlined">
            add
          </span>
          New
        </button>

      </div>

      <div className="profile-page__seperator"></div>

      {isLoading ? (
        <h3 className="profile-page__loading-title">Loading...</h3>
      ) : (
        <div className="profile-page__posts">
          {getFilteredPosts().map((post) => (
            <Post
              key={post.id}
              data={post}
              classes={{ root: 'profile-page__post' }}
            />
          ))}
        </div>
      )}

      {!isLoading && getFilteredPosts().length === 0 && (
        <h3 className="profile-page__no-posts-title">No posts</h3>
      )}

      {!isLoading && (
        <button type="button" className="profile-page__reload-btn" onClick={handleReloadBtnClick}>
          <span className="profile-page__icon profile-page__reload-icon material-icons-outlined">
            autorenew
          </span>
        </button>
      )}
      
    </Layout>
  </>
}
