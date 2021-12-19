import { collection, getDocs, query, where } from '@firebase/firestore'
import Layout from './Layout'
import Post from './Post'
import { db } from 'firebase'
import { FirestorePost } from 'firebase/documentTypes'
import { useEffect, useState } from 'react'
import { postsActions, ReduxPost, selectPosts } from 'redux/reducers/postsReducer'
import { useAppDispatch, useAppSelector, useQuery } from 'utils/hooks'
import { commonActions } from 'redux/reducers/commonReducer'
import PopupMenu from './PopupMenu'
import { useHistory, useLocation } from 'react-router-dom'
import { selectCurrentUser } from 'redux/reducers/authReducer'




type Props = {

}

type FilterType = 'all' | 'favourite' | 'not-favourite' | null

export default  ({}: Props) => {
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFilterMenuHidden, setIsFilterMenuHidden] = useState<boolean>(true)

  const history = useHistory()
  const location = useLocation()
  const params = useQuery()

  const dispatch = useAppDispatch()

  const currentUser = useAppSelector((state) => selectCurrentUser(state))
  const posts = useAppSelector((state) => selectPosts(state))

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      
      const snapshot = await getDocs(query(collection(db, 'posts'), where('authorUid', '==', currentUser!.uid)))

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

  const filterLabels = {
    'all': 'All',
    'favourite': 'Favourite',
    'not-favourite': 'Not Favourite'
  }

  const getSelectedFilter = (): FilterType => {
    return params.get('filter') as FilterType
  }

  const getFilteredPosts = () => {
    let filtered: ReduxPost[] = []
    
    filtered = posts.filter((post) => {
      if (post.desc.includes(searchInputValue)) {
        return true
      }
    })

    switch (getSelectedFilter()) {
      case 'all':
        filtered = filtered
        break
      case 'favourite':
        filtered = filtered.filter((post) => post.isFavourite == true)
        break
      case 'not-favourite':
        filtered = filtered.filter((post) => post.isFavourite == false)
        break
      default:
        filtered = filtered
    }

    return filtered
  }

  const handleFilterBtnClick = () => {
    if (isFilterMenuHidden) {
      setIsFilterMenuHidden(false)
    }
  }

  const handleReloadBtnClick = () => {
    loadPosts()
  }

  const handleAddPostBtn = () => {
    dispatch(commonActions.setCurrentVisibleModal('add-post'))
  }

  const handleFilterFavouruteBtnClick = () => {
    history.push(`${location.pathname}?filter=favourite`)

    setIsFilterMenuHidden(true)
  }

  const handleFilterAllBtnClick = () => {
    history.push(`${location.pathname}?filter=all`)

    setIsFilterMenuHidden(true)
  }

  const handleFilterNotFavouruteBtnClick = () => {
    history.push(`${location.pathname}?filter=not-favourite`)

    setIsFilterMenuHidden(true)
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

        <div className="profile-page__filter-btn-wrapper">
          <button type="button" className="profile-page__filter-btn" onClick={handleFilterBtnClick}>
            <span className="profile-page__icon material-icons-outlined">
              auto_awesome_mosaic
            </span>
            {filterLabels[getSelectedFilter() || 'all']}
          </button>

          <PopupMenu className="profile-page__filter-menu" isHidden={isFilterMenuHidden} onClose={() => setIsFilterMenuHidden(true)}>
            <ul className="profile-page__filter-menu-btns">
              <li className="profile-page__filter-menu-btns-item">
                <button type="button" className="profile-page__filter-menu-btn" onClick={handleFilterAllBtnClick}>
                  All
                </button>
              </li>
              <li className="profile-page__filter-menu-btns-item">
                <button type="button" className="profile-page__filter-menu-btn" onClick={handleFilterFavouruteBtnClick}>
                  Favourite
                </button>
              </li>
              <li className="profile-page__filter-menu-btns-item">
                <button type="button" className="profile-page__filter-menu-btn" onClick={handleFilterNotFavouruteBtnClick}>
                  Not favorute
                </button>
              </li>
            </ul>
          </PopupMenu>
        </div>

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
