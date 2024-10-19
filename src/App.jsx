import React, { useState, useEffect } from 'react';
import { Bell, Briefcase, Home, MessageSquare, Search, Users, Menu, X, Camera, UserPlus, UserCheck, Share2, Image, Video, Send, LogOut } from 'lucide-react';
import { LoginPage, SignUpPage } from './auth';

// Simulating React Router behavior
const Route = ({ path, children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);

    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  return currentPath === path ? children : null;
};

const Link = ({ to, children, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('/placeholder.svg?height=96&width=96');
  const [postMedia, setPostMedia] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating fetching posts from an API
    setPosts([
      { id: 1, user: 'John Doe', avatar: '/placeholder.svg?height=40&width=40', content: 'Just started a new project! #excited #newbeginnings', likes: 15, comments: 3, shares: 2 },
      { id: 2, user: 'Jane Smith', avatar: '/placeholder.svg?height=40&width=40', content: 'Excited about my new job at Tech Co! Looking forward to new challenges and opportunities. #newjob #techcareer', likes: 22, comments: 5, shares: 1 },
    ]);
  }, []);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() || postMedia) {
      setPosts([
        { id: posts.length + 1, user: currentUser.name, avatar: profilePhoto, content: newPost, likes: 0, comments: 0, shares: 0, media: postMedia },
        ...posts,
      ]);
      setNewPost('');
      setPostMedia(null);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostMedia({ type: file.type.startsWith('image') ? 'image' : 'video', url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically validate the credentials with a backend API
      console.log('Logging in with:', email, password);
      setCurrentUser({ name: 'John Doe', email: email });
      setIsLoggedIn(true);
      
      // Redirect to the main dashboard
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the sign-up data to a backend API
      console.log('Signing up with:', name, email, password);
      setCurrentUser({ name: name, email: email });
      setIsLoggedIn(true);
      setShowSignUp(false);
      
      // Redirect to the main dashboard
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    // Redirect to login page
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!isLoggedIn) {
    return showSignUp ? (
      <SignUpPage onSignUp={handleSignUp} onSwitchToLogin={() => setShowSignUp(false)} isLoading={isLoading} error={error} />
    ) : (
      <LoginPage onLogin={handleLogin} onSwitchToSignUp={() => setShowSignUp(true)} isLoading={isLoading} error={error} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} profilePhoto={profilePhoto} onLogout={handleLogout} currentUser={currentUser} />
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <Sidebar isMenuOpen={isMenuOpen} profilePhoto={profilePhoto} handleProfilePhotoChange={handleProfilePhotoChange} currentUser={currentUser} />
        <div className="flex-1">
          <Route path="/">
            <Feed
              posts={posts}
              newPost={newPost}
              setNewPost={setNewPost}
              handlePostSubmit={handlePostSubmit}
              profilePhoto={profilePhoto}
              postMedia={postMedia}
              handlePostMediaChange={handlePostMediaChange}
              currentUser={currentUser}
            />
          </Route>
          <Route path="/mynetwork">
            <MyNetwork />
          </Route>
          <Route path="/jobs">
            <Jobs />
          </Route>
          <Route path="/messaging">
            <Messaging />
          </Route>
          <Route path="/notifications">
            <Notifications />
          </Route>
        </div>
        <Profile profilePhoto={profilePhoto} handleProfilePhotoChange={handleProfilePhotoChange} currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
}

// ... (rest of the components remain unchanged)

function Header({ isMenuOpen, setIsMenuOpen, profilePhoto, onLogout, currentUser }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" className="mercado-match" width="24" height="24" focusable="false">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
          </Link>
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <nav className="hidden lg:flex items-center space-x-6">
          <NavItem to="/" icon={<Home size={20} />} text="Home" />
          <NavItem to="/mynetwork" icon={<Users size={20} />} text="My Network" />
          <NavItem to="/jobs" icon={<Briefcase size={20} />} text="Jobs" />
          <NavItem to="/messaging" icon={<MessageSquare size={20} />} text="Messaging" />
          <NavItem to="/notifications" icon={<Bell size={20} />} text="Notifications" />
          <img src={profilePhoto} alt="Profile" className="h-8 w-8 rounded-full border-2 border-blue-500 object-cover" />
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">{currentUser.name}</span>
            <button
              onClick={onLogout}
              className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="ml-1">Logout</span>
            </button>
          </div>
        </nav>
        <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

// ... (keep all the other component definitions unchanged)


function NavItem({ to, icon, text }) {
  return (
    <Link to={to} className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition-colors duration-200">
      {icon}
      <span className="text-xs mt-1">{text}</span>
    </Link>
  );
}

function Sidebar({ isMenuOpen, profilePhoto, handleProfilePhotoChange, currentUser }) {
  return (
    <aside className={`w-full lg:w-64 bg-white rounded-lg shadow-md p-4 space-y-4 ${isMenuOpen ? 'block' : 'hidden lg:block'}`}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <img src={profilePhoto} alt="Profile" className="h-24 w-24 rounded-full border-4 border-blue-500 mb-2 object-cover" />
          <label htmlFor="profile-photo-input" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer">
            <Camera size={16} className="text-white" />
          </label>
          <input
            id="profile-photo-input"
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="hidden"
          />
        </div>
        <h2 className="font-semibold text-lg">{currentUser.name}</h2>
        <p className="text-sm text-gray-500">Software Developer</p>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-2">Who viewed your profile: <span className="font-semibold text-blue-600">47</span></p>
        <p className="text-sm text-gray-500 mb-2">Views of your post: <span className="font-semibold text-blue-600">124</span></p>
      </div>
      <nav className="space-y-2">
        <SidebarItem to="/" icon={<Home size={20} />} text="Home" />
        <SidebarItem to="/mynetwork" icon={<Users size={20} />} text="My Network" />
        <SidebarItem to="/jobs" icon={<Briefcase size={20} />} text="Jobs" />
        <SidebarItem to="/messaging" icon={<MessageSquare size={20} />} text="Messaging" />
        <SidebarItem to="/notifications" icon={<Bell size={20} />} text="Notifications" />
      </nav>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-2">Access exclusive tools & insights</p>
        <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">
          Try Premium for free
        </a>
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, text }) {
  return (
    <Link to={to} className="flex items-center space-x-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 p-2 rounded transition-colors duration-200">
      {icon}
      <span>{text}</span>
    </Link>
  );
}

function Feed({ posts, newPost, setNewPost, handlePostSubmit, profilePhoto, postMedia, handlePostMediaChange }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
          ></textarea>
          {postMedia && (
            <div className="mt-2 relative">
              {postMedia.type === 'image' ? (
                <img src={postMedia.url} alt="Post media" className="max-h-60 rounded" />
              ) : (
                <video src={postMedia.url} className="max-h-60 rounded" controls />
              )}
              <button
                onClick={() => setPostMedia(null)}
                className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-2">
              <label className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors duration-200">
                <Image size={24} />
                <input type="file" accept="image/*" onChange={handlePostMediaChange} className="hidden" />
              </label>
              <label className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors duration-200">
                <Video size={24} />
                <input type="file" accept="video/*" onChange={handlePostMediaChange} className="hidden" />
              </label>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Post
            </button>
          </div>
        </form>
      </div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [shares, setShares] = useState(post.shares);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments(comments + 1);
      setNewComment('');
      // Here you would typically add the comment to a comments array
    }
  };

  const handleShare = () => {
    setShares(shares + 1);
    // Here you would typically implement the actual sharing functionality
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex items-center space-x-3">
        <img src={post.avatar} alt={post.user} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <h3 className="font-semibold text-lg">{post.user}</h3>
          <p className="text-sm text-gray-500">Posted 2h ago</p>
        </div>
      </div>
      <p className="text-gray-800">{post.content}</p>
      {post.media && (
        <div className="mt-2">
          {post.media.type === 'image' ? (
            <img src={post.media.url} alt="Post media" className="max-h-96 rounded" />
          ) : (
            <video src={post.media.url} className="max-h-96 rounded" controls />
          )}
        </div>
      )}
      <div className="flex justify-between items-center text-gray-500 pt-4 border-t border-gray-200">
        <button
          className={`flex items-center space-x-2 ${isLiked ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors duration-200`}
          onClick={handleLike}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>{likes}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200" onClick={() => setShowComments(!showComments)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span>{comments}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200" onClick={handleShare}>
          <Share2 size={20} />
          <span>{shares}</span>
        </button>
      </div>
      {showComments && (
        <div className="mt-4">
          <form onSubmit={handleComment} className="flex items-center space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MyNetwork() {
  const [connections, setConnections] = useState([
    { id: 1, name: 'Alice Johnson', title: 'UX Designer', avatar: '/placeholder.svg?height=64&width=64', connected: false },
    { id: 2, name: 'Bob Smith', title: 'Frontend Developer', avatar: '/placeholder.svg?height=64&width=64', connected: true },
    { id: 3, name: 'Charlie Brown', title: 'Product Manager', avatar: '/placeholder.svg?height=64&width=64', connected: false },
    { id: 4, name: 'Diana Ross', title: 'Data Scientist', avatar: '/placeholder.svg?height=64&width=64', connected: true },
  ]);

  const toggleConnection = (id) => {
    setConnections(connections.map(conn => 
      conn.id === id ? { ...conn, connected: !conn.connected } : conn
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Network</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((connection) => (
          <div key={connection.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
            <img src={connection.avatar} alt={connection.name} className="h-16 w-16 rounded-full object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{connection.name}</h3>
              <p className="text-sm text-gray-500">{connection.title}</p>
            </div>
            <button
              onClick={() => toggleConnection(connection.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                connection.connected
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              {connection.connected ? (
                <>
                  <UserCheck size={20} />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Connect</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Jobs() {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Frontend Developer', company: 'Tech Co', location: 'San Francisco, CA', salary: '$100k - $150k' },
    { id: 2, title: 'UX Designer', company: 'Design Inc', location: 'New York, NY', salary: '$90k - $120k' },
    { id: 3, title: 'Data Scientist', company: 'Data Corp', location: 'Seattle, WA', salary: '$120k - $180k' },
    { id: 4, title: 'Product Manager', company: 'Startup Ltd', location: 'Austin, TX', salary: '$110k - $160k' },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Jobs</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-gray-500">{job.location}</p>
            <p className="text-gray-500">{job.salary}</p>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Messaging() {
  const [conversations, setConversations] = useState([
    { id: 1, user: 'Alice Johnson', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Hey, how are you?' },
    { id: 2, user: 'Bob Smith', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Can we schedule a meeting?' },
    { id: 3, user: 'Charlie Brown', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Thanks for your help!' },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      // Here you would typically send the message to the server
      console.log(`Sending message to ${selectedConversation.user}: ${newMessage}`);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)]">
      <div className="w-1/3 bg-white rounded-lg shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold p-4 border-b">Messages</h2>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-4 flex items-center space-x-3 hover:bg-gray-100 cursor-pointer ${
              selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => setSelectedConversation(conversation)}
          >
            <img src={conversation.avatar} alt={conversation.user} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h3 className="font-semibold">{conversation.user}</h3>
              <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-2/3 bg-white rounded-lg shadow-md ml-4 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center space-x-3">
              <img src={selectedConversation.avatar} alt={selectedConversation.user} className="h-10 w-10 rounded-full object-cover" />
              <h2 className="font-semibold">{selectedConversation.user}</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
              {/* Messages would be displayed here */}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, user: 'Alice Johnson', avatar: '/placeholder.svg?height=40&width=40', action: 'liked your post', time: '2h ago' },
    { id: 2, user: 'Bob Smith', avatar: '/placeholder.svg?height=40&width=40', action: 'commented on your post', time: '4h ago' },
    { id: 3, user: 'Charlie Brown', avatar: '/placeholder.svg?height=40&width=40', action: 'shared your post', time: '1d ago' },
    { id: 4, user: 'Diana Ross', avatar: '/placeholder.svg?height=40&width=40', action: 'viewed your profile', time: '2d ago' },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
            <img src={notification.avatar} alt={notification.user} className="h-12 w-12 rounded-full object-cover" />
            <div className="flex-grow">
              <p>
                <span className="font-semibold">{notification.user}</span> {notification.action}
              </p>
              <p className="text-sm text-gray-500">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile({ profilePhoto, handleProfilePhotoChange, currentUser }) {
  return (
    <div className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="text-center">
        <div className="relative inline-block">
          <img src={profilePhoto} alt="Profile" className="h-24 w-24 rounded-full border-4 border-blue-500 mx-auto mb-2 object-cover" />
          <label htmlFor="profile-photo-input-2" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer">
            <Camera size={16} className="text-white" />
          </label>
          <input
            id="profile-photo-input-2"
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="hidden"
          />
        </div>
        <h2 className="font-semibold text-xl">{currentUser.name}</h2>
        <p className="text-gray-500">Software Developer</p>
      </div>
      <div className="space-y-4">
        <ProfileSection title="About">
          <p className="text-sm text-gray-600">Passionate about creating innovative solutions and learning new technologies.</p>
        </ProfileSection>
        <ProfileSection title="Experience">
          <p className="text-sm font-semibold">Senior Developer at Tech Co.</p>
          <p className="text-sm text-gray-500">2018 - Present</p>
        </ProfileSection>
        <ProfileSection title="Education">
          <p className="text-sm font-semibold">BS in Computer Science</p>
          <p className="text-sm text-gray-500">University of Technology, 2014-2018</p>
        </ProfileSection>
      </div>
    </div>
  );
}


function ProfileSection({ title, children }) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <FooterColumn title="About" links={['Company', 'Careers', 'Advertising', 'Small Business']} />
          <FooterColumn title="Community" links={['Groups', 'Events', 'Topics', 'Pages']} />
          <FooterColumn title="Privacy & Terms" links={['Privacy', 'Terms', 'Cookie Policy', 'Guidelines']} />
          <FooterColumn title="Sales Solutions" links={['Talent', 'Marketing', 'Sales', 'Learning']} />
          <FooterColumn title="Help Center" links={['FAQs', 'Contact Us', 'Accessibility', 'Safety Center']} />
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LinkedIn Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-semibold text-lg mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
