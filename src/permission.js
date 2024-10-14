import router from './router'
import {ElMessage} from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from '@/utils/auth'
import {isHttp} from '@/utils/validate'
import {isRelogin} from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import {checkRole} from "@/utils/permission.js";

NProgress.configure({showSpinner: false});

const whiteList = ['/login', '/register'];
const kuiHuaList = ['/dashboard', '/rule']

router.beforeEach((to, from, next) => {
    NProgress.start()
    if (getToken()) {
        to.meta.title && useSettingsStore().setTitle(to.meta.title)
        /* has token*/
        if (to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        } else if (whiteList.indexOf(to.path) !== -1 || kuiHuaList.indexOf(to.path) !== -1) {
            next()
        } else {
            if (useUserStore().roles.length === 0) {
                isRelogin.show = true
                // 判断当前用户是否已拉取完user_info信息
                useUserStore().getInfo().then(() => {
                    isRelogin.show = false
                    if (useUserStore().roles.includes('KhChecker') || useUserStore().roles.includes('admin')) {
                        usePermissionStore().generateRoutes().then(accessRoutes => {
                            // 根据roles权限生成可访问的路由表
                            accessRoutes.forEach(route => {
                                if (!isHttp(route.path)) {
                                    router.addRoute(route) // 动态添加可访问路由表
                                }
                            })
                            next({...to, replace: true}) // hack方法 确保addRoutes已完成
                        })
                    } else {
                        useUserStore().logOut().then(() => {
                            useUserStore().autoLogin = false
                            ElMessage.error("种草用户无管理权限，请向管理员确认")
                            next({path: '/'})
                        })
                    }

                }).catch(err => {
                    useUserStore().logOut().then(() => {
                        ElMessage.error(err)
                        next({path: '/'})
                    })
                })
            } else {
                next()
            }
        }
    } else {
        if (kuiHuaList.some(item => to.path.startsWith(item))) {
            next()
            NProgress.done()
            return
        }
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
