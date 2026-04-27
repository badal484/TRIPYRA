import { useState } from "react";
import Modal from "../../components/CustomModal";
import { IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile, setUpdated } from "../../redux/user/userSlice";
import { useForm } from "react-hook-form";

const ProfileEdit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { username, email, phoneNumber, adress, age, license, _id } = useSelector(
    (state) => state.user.currentUser
  );

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const editProfileData = async (data, id) => {
    try {
      if (data) {
        const formData = data;
        dispatch(editUserProfile({ ...formData }));
        await fetch(`/api/user/editUserProfile/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData }),
        });
        dispatch(setUpdated(true));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button 
        type="button" 
        className="text-white hover:rotate-12 transition-transform" 
        onClick={() => setIsModalOpen(true)}
      >
        <IconEdit size={24} />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="bg-white rounded-[40px] max-w-[600px] min-w-[360px] overflow-hidden shadow-2xl"
      >
        <form onSubmit={handleSubmit((data) => editProfileData(data, _id))}>
          <div className="p-10">
            <div className="mb-8">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit <span className="text-zoom-green">Profile</span></h2>
               <p className="text-slate-400 font-medium text-xs">Update your personal details and mobility credentials.</p>
            </div>

            <div className="flex flex-col gap-6 mb-10">
              <TextField
                id="username"
                label="Full Name"
                variant="outlined"
                fullWidth
                {...register("username")}
                defaultValue={username}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />

              <TextField
                id="email"
                label="Email Address"
                variant="outlined"
                fullWidth
                defaultValue={email}
                {...register("email")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />
              
              <div className="grid grid-cols-2 gap-6">
                <TextField
                  id="phoneNumber"
                  label="Phone Number"
                  type="text"
                  variant="outlined"
                  defaultValue={phoneNumber}
                  {...register("phoneNumber")}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
                <TextField
                  id="age"
                  label="Age"
                  type="number"
                  variant="outlined"
                  defaultValue={age}
                  {...register("age")}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
              </div>

              <TextField
                id="license"
                label="Driving License Number"
                variant="outlined"
                fullWidth
                defaultValue={license}
                {...register("license")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />

              <TextField
                id="adress"
                label="Physical Address"
                multiline
                rows={3}
                fullWidth
                defaultValue={adress}
                {...register("adress")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />
            </div>

            <div className="flex justify-end items-center gap-3">
              <button
                type="button"
                className="px-8 h-12 rounded-2xl text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-100"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 h-12 rounded-2xl text-white bg-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-zoom-green transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                onClick={() => setIsModalOpen(false)}
              >
                Save Changes <IconCheck size={16} />
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileEdit;
