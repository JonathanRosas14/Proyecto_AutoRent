import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Main_page from "../components/Main_page.vue";

const routes = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/dashboard",
    component: Main_page,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("../components/Dashboard.vue"),
      },
      {
        path:"/reservation",
        name:"Reservations",
        component: () => import("../components/Reservations.vue")
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("../components/Settings.vue")
      },
      {
        path: "/support",
        name: "Support",
        component: () => import ("../components/Support.vue")
      },
      {
        path: "/category/:type",
        name: "Category",
        component: () => import ("../components/CategoryCars.vue")
      },
      {
        path: "/car/:id",
        name: "CarDetail",
        component: () => import ("../components/CarDetail.vue")
      }

    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
