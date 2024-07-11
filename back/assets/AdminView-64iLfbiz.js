import{a as h}from"./axios-B4uVmeYG.js";import{_,c as r,a as e,n as c,t as n,f as m,g as p,F as f,r as v,b as u,v as g,h as w,o as d,p as A,d as b}from"./index-CcafUdp0.js";const I={data(){return{permissions:[],filter:"all",activeCount:0,inactiveCount:0,totalCount:0,page:1,perPage:10,showModal:!1,newUser:{name:"",password:"",role:"後台人員",status:"1"},isSuperAdmin:!1,currentAdminId:null}},computed:{filteredPermissions(){let s=this.permissions;return this.filter==="active"?s=this.permissions.filter(t=>t.a_status==="1"):this.filter==="inactive"&&(s=this.permissions.filter(t=>t.a_status==="0")),s.slice((this.page-1)*this.perPage,this.page*this.perPage)},totalPages(){return Math.ceil(this.permissions.length/this.perPage)}},methods:{async fetchPermissions(){try{console.log("正在獲取權限資訊"),console.log("當前管理員ID:",this.currentAdminId);const s=await h.get("http://localhost/phpG6/api/admin_management.php?action=getAllAdmin",{headers:{"X-Admin-Id":this.currentAdminId}});if(console.log("獲取權限資訊的響應:",s.data),s.data.success)this.permissions=s.data.data,this.calculatePermissionCounts();else throw new Error(s.data.message)}catch(s){console.error("獲取權限資訊時出錯:",s),alert("獲取管理員列表失敗: "+s.message)}},calculatePermissionCounts(){this.totalCount=this.permissions.length,this.activeCount=this.permissions.filter(s=>s.a_status==="1").length,this.inactiveCount=this.permissions.filter(s=>s.a_status==="0").length},filterPermissions(s){this.filter=s,this.page=1},showAddUserModal(){console.log("嘗試顯示新增用戶模態窗"),console.log("當前管理員ID:",this.currentAdminId),console.log("是否為超級管理員:",this.isSuperAdmin),this.isSuperAdmin?(this.showModal=!0,this.resetNewUser()):(console.log("非超級管理員，無法新增用戶"),alert("只有超級管理員可以新增後台人員"))},async addNewUser(){if(console.log("嘗試新增用戶"),console.log("是否為超級管理員:",this.isSuperAdmin),console.log("當前管理員ID:",this.currentAdminId),!this.isSuperAdmin){console.log("非超級管理員，無法新增用戶"),alert("只有超級管理員可以新增後台人員");return}try{console.log("發送新增用戶請求"),console.log("請求頭:",{"X-Admin-Id":this.currentAdminId});const s=await h.post("http://localhost/phpG6/api/admin_management.php?action=addAdmin",this.newUser,{headers:{"X-Admin-Id":this.currentAdminId}});if(console.log("服務器響應:",s.data),s.data.success)alert("管理員新增成功"),this.showModal=!1,this.fetchPermissions(),this.resetNewUser();else throw new Error(s.data.message)}catch(s){console.error("新增用戶時出錯:",s),alert("新增管理員失敗: "+s.message)}},resetNewUser(){this.newUser={name:"",password:"",role:"後台人員",status:"1"}},async toggleUserStatus(s){if(console.log("嘗試切換用戶狀態"),console.log("是否為超級管理員:",this.isSuperAdmin),console.log("當前管理員ID:",this.currentAdminId),console.log("要切換狀態的用戶:",s),!this.isSuperAdmin||s.a_role==0){console.log("無法切換狀態：非超級管理員或目標為超級管理員");return}try{console.log("發送切換用戶狀態請求"),console.log("請求頭:",{"X-Admin-Id":this.currentAdminId});const t=await h.post("http://localhost/phpG6/api/admin_management.php?action=toggleAdminStatus",{id:s.a_id},{headers:{"X-Admin-Id":this.currentAdminId}});if(console.log("服務器響應:",t.data),t.data.success)s.a_status=s.a_status==="1"?"0":"1",this.calculatePermissionCounts();else throw new Error(t.data.message)}catch(t){console.error("切換用戶狀態時出錯:",t),alert("更新管理員狀態失敗: "+t.message)}},prevPage(){this.page>1&&this.page--},nextPage(){this.page<this.totalPages&&this.page++}},mounted(){const s=JSON.parse(localStorage.getItem("adminInfo"));console.log("從 localStorage 獲取的管理員資訊:",s),s?(console.log("管理員角色:",s.a_role),console.log("管理員角色類型:",typeof s.a_role),this.isSuperAdmin=s.a_role=="0"||s.a_role==0,this.currentAdminId=s.a_id,console.log("是否為超級管理員:",this.isSuperAdmin),console.log("當前管理員ID:",this.currentAdminId),this.fetchPermissions()):(console.log("在 localStorage 中未找到管理員資訊"),this.$router.push({name:"LoginView"}))}},a=s=>(A("data-v-ebd895ab"),s=s(),b(),s),P={class:"admin_permissions"},S={class:"admin_permissions_container"},U=a(()=>e("h3",null,"管理員權限",-1)),C={class:"btns-container"},k={class:"btns"},y=["disabled"],M={key:0},x={class:"permissions-table"},N=a(()=>e("thead",null,[e("tr",null,[e("th",null,"管理員編號"),e("th",null,"名稱"),e("th",null,"權限等級"),e("th",null,"啟用狀態"),e("th",null,"操作")])],-1)),V=a(()=>e("i",{class:"circle"},null,-1)),D=["onClick","disabled"],X={key:0},E={key:1},B={class:"pagination"},G=["disabled"],F=["disabled"],L={key:0,class:"modal"},T={class:"modal-content"},z=a(()=>e("h4",null,"新增後台人員",-1)),J=a(()=>e("label",null,"管理員姓名",-1)),O=a(()=>e("label",null,"狀態",-1)),j=a(()=>e("option",{value:"1"},"啟用",-1)),q=a(()=>e("option",{value:"0"},"停用",-1)),H=[j,q],K=a(()=>e("label",null,"密碼",-1)),Q=a(()=>e("label",null,"權限等級",-1));function R(s,t,W,Y,i,l){return d(),r("div",P,[e("div",S,[U,e("div",C,[e("ul",k,[e("li",{class:c(["btn",{active:i.filter==="active"}]),onClick:t[0]||(t[0]=o=>l.filterPermissions("active"))}," 啟用中("+n(i.activeCount)+") ",3),e("li",{class:c(["btn",{active:i.filter==="inactive"}]),onClick:t[1]||(t[1]=o=>l.filterPermissions("inactive"))}," 未啟用("+n(i.inactiveCount)+") ",3),e("li",{class:c(["btn",{active:i.filter==="all"}]),onClick:t[2]||(t[2]=o=>l.filterPermissions("all"))}," 全部("+n(i.totalCount)+") ",3)]),e("button",{class:"btn add-button",onClick:t[3]||(t[3]=(...o)=>l.showAddUserModal&&l.showAddUserModal(...o)),disabled:!i.isSuperAdmin},[m(" +新增後台人員 "),i.isSuperAdmin?p("",!0):(d(),r("span",M,"(僅限超級管理員)"))],8,y)]),e("table",x,[N,e("tbody",null,[(d(!0),r(f,null,v(l.filteredPermissions,o=>(d(),r("tr",{key:o.a_id},[e("td",null,n(o.a_id),1),e("td",null,n(o.a_name),1),e("td",null,n(o.a_role==="0"?"主要管理員":"後台人員"),1),e("td",null,[e("span",{class:c(["status",{active:o.a_status==="1",inactive:o.a_status==="0"}])},[V,m(" "+n(o.a_status==="1"?"啟用":"未啟用"),1)],2)]),e("td",null,[e("button",{onClick:Z=>l.toggleUserStatus(o),class:c(["toggle-btn",{disabled:!i.isSuperAdmin||o.a_role==="0"}]),disabled:!i.isSuperAdmin||o.a_role==="0"},[m(n(o.a_status==="1"?"停用":"啟用")+" ",1),i.isSuperAdmin?o.a_role==="0"?(d(),r("span",E,"(無法更改超級管理員狀態)")):p("",!0):(d(),r("span",X,"(僅限超級管理員)"))],10,D)])]))),128))])]),e("div",B,[e("button",{onClick:t[4]||(t[4]=(...o)=>l.prevPage&&l.prevPage(...o)),disabled:i.page===1},"‹",8,G),e("span",null,n(i.page)+" / "+n(l.totalPages),1),e("button",{onClick:t[5]||(t[5]=(...o)=>l.nextPage&&l.nextPage(...o)),disabled:i.page===l.totalPages},"›",8,F)])]),i.showModal?(d(),r("div",L,[e("div",T,[z,e("div",null,[J,u(e("input",{"onUpdate:modelValue":t[6]||(t[6]=o=>i.newUser.name=o),placeholder:"請輸入姓名"},null,512),[[g,i.newUser.name]])]),e("div",null,[O,u(e("select",{"onUpdate:modelValue":t[7]||(t[7]=o=>i.newUser.status=o)},H,512),[[w,i.newUser.status]])]),e("div",null,[K,u(e("input",{"onUpdate:modelValue":t[8]||(t[8]=o=>i.newUser.password=o),type:"password",placeholder:"請輸入密碼"},null,512),[[g,i.newUser.password]])]),e("div",null,[Q,u(e("input",{type:"text","onUpdate:modelValue":t[9]||(t[9]=o=>i.newUser.role=o),readonly:""},null,512),[[g,i.newUser.role]])]),e("button",{onClick:t[10]||(t[10]=(...o)=>l.addNewUser&&l.addNewUser(...o))},"儲存"),e("button",{onClick:t[11]||(t[11]=o=>i.showModal=!1)},"取消")])])):p("",!0)])}const se=_(I,[["render",R],["__scopeId","data-v-ebd895ab"]]);export{se as default};
