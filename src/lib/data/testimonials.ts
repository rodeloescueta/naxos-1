export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Raihan Rahardika",
    role: "Students",
    comment: "You Won't Find A Restaurant In Greenland That Serves Such Amazing Food. Their New Menu Surprised Me. All New, Never Seen And Tasted Such Food Before In My Life. Keep On Creating New Menus I'm Really Looking Forward To It.",
    image: "/images/reviewer/avatar.png"
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    role: "Food Critic",
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. The flavors are extraordinary and presentation is impeccable.",
    image: "/images/reviewer/avatar.png"
  },
  {
    id: "3",
    name: "James Wilson",
    role: "Food Blogger",
    comment: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. The ambiance and service are top-notch.",
    image: "/images/reviewer/avatar.png"
  }
]; 