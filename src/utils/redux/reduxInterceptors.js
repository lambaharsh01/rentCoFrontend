// import moment from "moment";
import tenantDetailsStore from "./reduxStores/tenantDetails.js";
import axiosInterceptor from "../axiosInterceptor.js";

import { toast } from "react-toastify";

window.addEventListener("load", () => {
  localStorage.setItem("getTenantDetailsReload", "0"); //taking it 0 when ever the page refreshes it becomes 0
});

export function getTenantDetails(update = false, empty = false) {
  let getTenantDetailsReload = localStorage.getItem("getTenantDetailsReload");

  if (empty) {
    tenantDetailsStore.dispatch({ type: "insertData", payload: [] });
    return [];
  }

  if (update) {
    updateTenantDetails();
    return [];
  } else {
    if (getTenantDetailsReload === "1") {
      //if page was not refreshed localstorage's getTenantDetailsReload must have had become 1 at the login and data will be fetched from store as uaual
      return tenantDetailsStore.getState();
    } else {
      // if the page was reloaded the localstorage's getTenantDetailsReload must be 0 and the api will be hit to fetch the data and put it in the store
      updateTenantDetails()
        .then(() => {
          return tenantDetailsStore.getState();
        })
        .catch(() => {
          return [];
        });
    }
  }

  function updateTenantDetails() {
    return new Promise((resolve, reject) => {
      axiosInterceptor({
        url: "/api/tenant/getAllTenants",
        method: "get",
      })
        .then((res) => {
          let labledArray = res?.data?.tenantDetails?.map((element) => {
            let label = element.tenantName + " | " + element.propertyName;
            return { ...element, label };
          });

          localStorage.setItem("getTenantDetailsReload", "1"); // making the getTenantDetailsReload 1 once the data i fetched from the api

          resolve(
            tenantDetailsStore.dispatch({
              type: "insertData",
              payload: labledArray ?? [],
            })
          );

          resolve(labledArray ?? []);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Tenant details could not be fetched");
          reject(err);
        });
    });
  }
}
