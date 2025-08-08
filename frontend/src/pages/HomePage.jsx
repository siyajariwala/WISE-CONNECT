import { useQueryClient,useQuery,useMutation } from '@tanstack/react-query';
import { useState,useEffect } from 'react';
import { capitalize } from '../lib/utils';
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import quotes from '../constants/Quotes';
const HomePage = () => {
const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));
const currentQuote = quotes[quoteIndex];

function getNewQuote() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * quotes.length);
  } while (newIndex === quoteIndex);
  setQuoteIndex(newIndex);
}
   

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });
useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);


return (

  <div className="flex min-h-screen bg-base-100">
      {/* Main Content */}
      <main className="flex-1 px-6 py-8 space-y-10">
        {/* Welcome */}
        <section className="mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content ">
            Welcome to WISE-CONNECT 🌐
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-medium text-base-content max-w-4xl">
            WISE-CONNECT is a vibrant platform where students in <span className="font-semibold text-primary">STEM</span> connect, collaborate, and grow together. Whether you're seeking
            <span className="font-semibold text-secondary"> study partners</span>, <span className="font-semibold text-accent">project teammates</span>, or friends with
            <span className="font-semibold text-info"> shared goals</span>, you’ve landed in the right place.
          </p>
        </section>

        {/* Meet New Learners */}
        <section className='mb-10'>
          <h2 className="text-2xl font-bold mb-10">Meet New Learners</h2>
          {loadingUsers ? (
            <div className="text-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="bg-base-200 p-6 rounded text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-sm text-base-content/70">Check back later for new learners.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div key={user._id} className="bg-base-200 rounded-xl p-5 space-y-4 shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                      <img src={user.profilePic} alt={user.fullName} className="w-14 h-14 rounded-full object-cover"  onError={(e) => {
    e.currentTarget.onerror = null; // prevent infinite loop
    e.currentTarget.src = "/avatar-fallback.png"; // local file in /public
  }}/>
                      <div>
                        <h3 className="font-semibold">{user.fullName}</h3>
                        
                      </div>
                    </div>
<div className="flex flex-col gap-1 text-xs">
  {/* Field pill (solid) */}
  <div className="w-full rounded-full bg-secondary text-secondary-content px-2 py-1
                  whitespace-pre-wrap break-words leading-snug overflow-hidden">
    <span className="font-medium">Field:</span> {capitalize(user.fieldOfStudy)}
  </div>

  {/* Looking for pill (outline) */}
  <div className="w-full rounded-full border border-base-300 px-2 py-1
                  whitespace-pre-wrap break-words leading-snug overflow-hidden">
    <span className="font-medium">Looking for:</span> {capitalize(user.lookingFor)}
  </div>
</div>
                    {user.bio && <p className="text-sm text-base-content/70">{user.bio}</p>}
                    <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Sidebar with STEM Quote */}
      <aside className="flex flex-col p-4 bg-base-200 text-base-content w-full sm:w-72">
        <div>
          <h2 className="text-xl font-bold mb-4">🌟 STEM Quote of the Day</h2>
          <p className="italic text-3xl mb-2">“{currentQuote.text}”</p>
          <p className="text-right text-sm font-semibold mb-4">— {currentQuote.author}</p>
        </div>
        <button
          onClick={getNewQuote}
          className="w-full px-4 py-2 mb-2 rounded bg-primary text-primary-content hover:opacity-90"
        >
          Next Quote
        </button>
      </aside>
    </div>
  );

}

export default HomePage;
