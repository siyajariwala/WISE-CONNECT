import  { useState } from 'react';
import toast from "react-hot-toast";
import{ShipWheelIcon, ShuffleIcon,LoaderIcon} from "lucide-react";
import { completeOnboarding } from '../lib/api';
import useAuthUser from '../hooks/useAuthUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const OnboardingPage = () => {
  const {authUser}=useAuthUser();
  const queryClient=useQueryClient();

  const [formState,setFormState]=useState({
    fullName:authUser?.fullName || "",
    bio:authUser?.bio || "",
     year: authUser?.year || "", 
    fieldOfStudy:authUser?.fieldOfStudy || "",
    roleInClub:authUser?.roleInClub || "",
    lookingFor:authUser?.lookingFor || "",
    profilePic:authUser?.profilePic || "",

  });

  const{mutate:onboardingMutation,isPending}=useMutation({
    mutationFn:completeOnboarding,
    onSuccess:()=>{
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({queryKey:["authUser"]});
    },
    onError:(error)=>{
    toast.error(error.response.data.message);
  },
  });
  

  const handleSubmit=(e)=>{
    e.preventDefault();
    onboardingMutation(formState);
  }
  const handleRandomAvatar=()=>{
    const idx=Math.floor(Math.random()*100)+1;
    const randomAvatar=`https://api.dicebear.com/7.x/adventurer/svg?seed=${idx}`;
    setFormState({...formState,profilePic:randomAvatar});
    toast.success("Random profile pic generated");
  };
  return (
    
 
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
     <div className="card-body p-6 sm:p-8">
      <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="size-32 rounded-full bg-base-300 overflow-hidden">
          {formState.profilePic?(
<img src={formState.profilePic}
        alt="Profile preview"
        className='w-full h-full object-cover'/>
            ):(
              <div className="flex items-center justify-center h-full">
                <CameraIcon className="size-12 text-base-content opacity-40"/>
              </div>
            )}

        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleRandomAvatar} className='btn btn-accent'>
            <ShuffleIcon className="size-4 mr-2"/>
            Generate Random Avatar
          </button>
        </div>









</div>

<div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

<div className="form-control">
  <label className="label">
    <span className="label-text">Field of Study</span>
  </label>
  <input
    type="text"
    name="fieldOfStudy"
    placeholder="e.g., Computer Science"
    className="input input-bordered w-full"
    value={formState.fieldOfStudy}
    onChange={(e) =>
      setFormState({ ...formState, fieldOfStudy: e.target.value })
    }
    required
  />
</div>

<div className="form-control">
  <label className="label">
    <span className="label-text">Year</span>
  </label>
  <select
    name="year"
    value={formState.year}
    onChange={(e) => setFormState({ ...formState, year: e.target.value })}
    className="select select-bordered w-full"
    required
  >
    <option value="">Select your year</option>
    <option value="freshman">Freshman</option>
    <option value="sophomore">Sophomore</option>
    <option value="junior">Junior</option>
    <option value="senior">Senior</option>
    <option value="graduate">Graduate</option>
  </select>
</div>


<div className="form-control">
  <label className="label">
    <span className="label-text">Your Role in the Club</span>
  </label>
  <select
    name="roleInClub"
    value={formState.roleInClub}
    onChange={(e) =>
      setFormState({ ...formState, roleInClub: e.target.value })
    }
    className="select select-bordered w-full"
    required
  >
    <option value="">Select your role</option>
    <option value="member">Member</option>
    <option value="officer">Officer</option>
    <option value="mentor">Mentor</option>
    <option value="mentee">Mentee</option>
  </select>
</div>


<div className="form-control">
  <label className="label">
    <span className="label-text">What are you looking for?</span>
  </label>
  <textarea
    name="lookingFor"
    placeholder="e.g., mentorship, collaboration on STEM projects, leadership experience..."
    className="textarea textarea-bordered w-full"
    rows={3}
    value={formState.lookingFor}
    onChange={(e) =>
      setFormState({ ...formState, lookingFor: e.target.value })
    }
    required
  />
</div>

<button className='btn btn-primary w-full' disabled={isPending} type='submit'>
  {!isPending?(
    <>
    <ShipWheelIcon className='size05 mr-2'/>
    Complete Onboarding
      </>
  ):(
    <>
    <LoaderIcon className=' animate-spin size05 mr-2'/>
   Onboarding...
      </>
  )}

</button>


</form>
</div>
</div>
</div>
  );
}

export default OnboardingPage;
