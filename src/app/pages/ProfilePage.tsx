import { motion } from "framer-motion";
import { Mail, Calendar, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuthStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const ProfilePage = () => {
  const { userData, setLogoutUser } = useAuthStore();

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        variants={itemVariants}
      >
        User Profile
      </motion.h1>
      <motion.div variants={itemVariants}>
        <Card className="bg-gray-900 border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white font-semibold text-2xl">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center">
              <div className="text-white w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-2xl font-bold mr-6">
                {userData.first_name.charAt(0).toUpperCase()}
                {userData.last_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {userData.first_name} {userData.last_name}
                </h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-4 text-gray-400" />
                <p className="text-white font-semibold">john.doe@example.com</p>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-4 text-gray-400" />
                <p className="text-white font-semibold">
                  Member since: {userData.createdAt.slice(0, 10)}
                </p>
              </div>
            </div>
            <div className="space-x-4">
              <Button
                onClick={setLogoutUser}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
