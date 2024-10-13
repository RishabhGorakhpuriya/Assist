import React, { useEffect, Suspense, lazy } from 'react'
import SideBar from './SideBar'
import { useGlobalContext } from './context/context';
import { Link } from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
const Loading = lazy(() => import('./Loading'));


const topic = [
  { id: 1, name: "General Knowledge", image: '/image/general-knowledge.avif' },
  { id: 2, name: "Mathematics", image: '/image/mathematics.avif' },
  { id: 3, name: "Science", image: '/image/science.avif' },
  { id: 4, name: "Technology", image: '/image/technology.avif' },
  { id: 5, name: "English", image: '/image/english.avif' },
  { id: 6, name: "Arts", image: '/image/arts.avif' },
  { id: 7, name: "Biology", image: '/image/biology.avif' },
  { id: 8, name: "Chemistry", image: '/image/chemistry.avif' },
  { id: 9, name: "Physics", image: '/image/physics.avif' },
  { id: 10, name: "Coding", image: '/image/coding.avif' },
  { id: 11, name: "Business and Economics", image: '/image/business-and-economics.avif' }
]

const CategoryCard = ({ top }) => (
  (<Link to={`/question-bank/${top.name}`}>
    <div className="bg-white shadow-lg rounded-lg  transition-transform transform hover:scale-105 hover:shadow-xl mt-10">
      <CardActionArea>
        <CardMedia
          component="img"
          image={top.image}
          alt={top.name}
          style={{height : "200px"}}
        />
        <CardContent>
          <Typography className='text-center' gutterBottom variant="h5" component="div">
            {top.name}
          </Typography>

        </CardContent>
      </CardActionArea>
    </div>
  </Link>)
);


const QuestionCategory = () => {
  const { assessments, setFilteredAssessments, searchTerm, setSearchTerm, UserRole, filteredAssessments, loading } = useGlobalContext();

  useEffect(() => {
    // Only filter assessments if `topic` is an array
    if (Array.isArray(topic)) {
      setFilteredAssessments(
        topic.filter((top) => {
          // Ensure `top.name` is defined before accessing it
          const name = top.name ? top.name.toLowerCase() : '';
          return name.includes(searchTerm.toLowerCase());
        })
      );
    } else {
      // Reset filtered assessments if topic is not an array
      setFilteredAssessments([]);
    }
  }, [searchTerm, topic]);


  return (
    <div className="w-full flex flex-row h-screen">
      <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="w-full  pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 014.743 12.743l4.577 4.576a1 1 0 001.414-1.414l-4.577-4.576A7 7 0 1111 4z"></path>
              </svg>
            </span>
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            Clear
          </button>
        </div>
        <div>
          <Suspense fallback={<div className="flex justify-center items-center h-full"><Loading/></div>}>
            {loading ? (
              <Loading/>
            ) : (
              <div>
                {filteredAssessments.length > 0 ? (
                  UserRole === 'teacher' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredAssessments.map((top) => (
                        <CategoryCard key={top.id} top={top} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-3xl text-center text-gray-500 mt-4">No assessments available</p>
                  )
                ) : (
                  <p className="text-3xl text-center text-gray-500 mt-4">No assessments found</p>
                )}
              </div>
            )}
            </Suspense>
        </div>
      </div>
    </div>
  )
}

export default QuestionCategory
