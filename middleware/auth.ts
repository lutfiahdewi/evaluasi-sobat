

export default defineNuxtRouteMiddleware( (to, from) => {
    console.log(to);
    console.log(from);

    const isAuthorized = false;

    if (isAuthorized){
        return navigateTo(to.fullPath);
    }
    return navigateTo("/login");
});
