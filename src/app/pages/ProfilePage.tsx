import { motion } from "framer-motion";
import { Mail, Calendar, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-2xl font-bold mr-6">
                JD
              </div>
              <div>
                <h2 className="text-2xl font-semibold">John Doe</h2>
                <p className="text-gray-400">Movie Enthusiast</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-4 text-gray-400" />
                <p>john.doe@example.com</p>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-4 text-gray-400" />
                <p>Member since: January 1, 2023</p>
              </div>
            </div>
            <Button className="w-full sm:w-auto">
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
