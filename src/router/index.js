import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewView from '../views/NewView.vue'
import MenView from '../views/MenView.vue'
import WomenView from '../views/WomenView.vue'
import WatchView from '../views/WatchView.vue'
import PerfumeView from '../views/PerfumeView.vue'
import JewelryView from '../views/JewelryView.vue'
import FallView from '@/views/FallView.vue'
import NewFormalView from '@/views/NewFormalView.vue'
import TravelView from '@/views/TravelView.vue'
import AccessoriesView from '@/views/AccessoriesView.vue'
import BagsView from '@/views/BagsView.vue'
import FashionView from '@/views/FashionView.vue'
import ReadyWearView from '@/views/Ready-WearView.vue'
import WTravelView from '@/views/WTravelView.vue'
import ShoesView from '@/views/ShoesView.vue'
import Cart from '@/components/CartPage.vue'
import InventoryView from '@/views/Admin/InventoryView.vue'
import PromotionView from '@/views/Admin/PromotionView.vue'
import CreateClientView from '@/views/Admin/CreateClientView.vue'
import ClientView from '@/views/Admin/ClientView.vue'
import RevenueView from '@/views/Admin/RevenueView.vue'
import OrderingView from '@/views/Admin/OrderingView.vue'
import LoginView from '@/views/Admin/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/new',
      name: 'new',
      component: NewView
    },
    {
      path: '/men',
      name: 'men',
      component: MenView
    },
    {
      path: '/men/fall',
      name: 'fall',
      component: FallView
    },
    {
      path: '/men/new-formal',
      name: 'new-formal',
      component: NewFormalView
    },
    {
      path: '/men/travel',
      name: 'travel',
      component: TravelView
    },
    {
      path: '/women',
      name: 'women',
      component: WomenView
    },
    {
      path: '/women/bags',
      name: 'bags',
      component: BagsView
    },
    {
      path: '/women/accessories',
      name: 'accessories',
      component: AccessoriesView
    },
    {
      path: '/women/fashion',
      name: 'fashion',
      component: FashionView
    },
    {
      path: '/women/ready-wear',
      name: 'ready-wear',
      component: ReadyWearView
    },
    {
      path: '/women/wtravel',
      name: 'wtravel',
      component: WTravelView
    },
    {
      path: '/women/shoes',
      name: 'shoes',
      component: ShoesView
    },
    {
      path: '/watch',
      name: 'watch',
      component: WatchView
    },
    {
      path: '/perfume',
      name: 'perfume',
      component: PerfumeView
    },
    {
      path: '/jewelry',
      name: 'jewelry',
      component: JewelryView
    },
    {
      path: '/shopping-cart',
      name: 'shopping-cart',
      component: Cart
    },
    {
      path: '/admin/inventory',
      name: 'inventory',
      component: InventoryView
    },
    {
      path: '/admin/promotion',
      name: 'promotion',
      component: PromotionView
    },
    {
      path: '/admin/create-client',
      name: 'create-client',
      component: CreateClientView
    },
    {
      path: '/admin/client',
      name: 'client',
      component: ClientView
    },
    {
      path: '/admin/revenue',
      name: 'revenue',
      component: RevenueView
    },
    {
      path: '/admin/ordering',
      name: 'ordering',
      component: OrderingView
    },
    {
      path: '/admin',
      name: 'admin-login',
      component: LoginView
    }
  ]
})

export default router
