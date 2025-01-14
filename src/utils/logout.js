export const logOut = () => {
    let logOutConfirm = window.confirm("Are you sure you want to Log out of RentCo.");

    if (!logOutConfirm) return;

      localStorage.removeItem("authToken");
      window.location.href = "/";    
  }