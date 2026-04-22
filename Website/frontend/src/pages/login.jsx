import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Info_Modal from '../components/info_modal';
//import { useAuth } from '../context/Auth_Context';
import { Mail, Lock, Eye, EyeOff, ArrowRight, School } from 'lucide-react';

export default function Login_Page(){
  const navigate = useNavigate();
  //const { refresh } = useAuth();

  const [user, set_user] = useState({
    id: "",
    password: ""
  })

  const api_url = "http://127.0.0.1:5000";

  const [showPassword, setShowPassword] = useState(false);
  const [open_modal, set_open_modal] = useState(false)
  const [message_type, set_message_type] = useState("error")
  const [message, set_message] = useState("Tests")
  const [Form_errors, Set_Form_Errors] = useState({})

  const Handle_Info_Display = (type, message) =>{
    set_open_modal(true)
    set_message_type(type)
    set_message(message)
  }

  const handle_login = async (e) => {
    e.preventDefault();
    console.log(user)
    if (!user.id || !user.password) {
      Set_Form_Errors({ backend: "Please enter both username and Password" });
      return;
    }

    try {
      Set_Form_Errors({});

      const response = await fetch(`${api_url}/login`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Message || "Login failed");
      }
      await refresh()
      navigate('/', { replace: true })

    } catch (err) {
      Set_Form_Errors({ backend: err.message });
    }
  };

  useEffect(() => {
    const errorFields = Object.keys(Form_errors);

    if (errorFields.length > 0) {
      const firstField = errorFields[0];
      const errorMessage = Form_errors[firstField];
      Handle_Info_Display("error", `${errorMessage}`);
    }

  }, [Form_errors]);

  return (
    <div className="min-h-screen w-full flex justify-center bg-white">
      
      {/* --- Left Side: Content & Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32">
        
        {/* Branding/Logo Area */}
        <div className="mb-5">
          <h1 className="text-4xl font-bold text-violet-900 tracking-tight">Please sign in to view the Stream</h1>
        </div>
          {
            open_modal && (
                <Info_Modal 
                    message={message} 
                    type={message_type}
                    onClose={() => set_open_modal(false)}
                />
            )
          }
        {/* The Form */}
        <form onSubmit={handle_login} className="space-y-6">
          <div className="space-y-2">
            <label className="flex justify-between text-sm font-semibold text-slate-700 mt-4">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600">
                <Mail size={20} />
              </div>
              <input 
                type="text"
                placeholder="00000"
                value={user.id}
                onChange={(e) => set_user(prev => ({...prev, id: e.target.value}))}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-600 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              {//<a href="#" className="text-sm font-semibold text-violet-600 hover:text-violet-700">Forgot?</a>
              }
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600">
                <Lock size={20} />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={user.password}
                onChange={(e) => set_user(prev => ({...prev, password: e.target.value}))}
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-600 focus:bg-white transition-all outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button className="w-full bg-violet-900 hover:bg-violet-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all active:scale-[0.98]">
            Sign In
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        
          {
            //<p className="mt-8 text-center text-slate-500 text-sm">
            // Don't have an account? <a href="#" className="font-bold text-slate-900 hover:underline">Contact Admin</a>
            //</p>
          }
        
      </div>

    </div>
  );
};
