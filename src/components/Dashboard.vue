<template>
<div>
    
    <Navbar/>
    <Alert/>
    <div class="container-fluid">
    <div class="row">
        <Sidebar></Sidebar>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <router-view></router-view>
        </main>
    </div>
    </div>
</div>
</template>

<script>
import Sidebar from './sidebar';
import Navbar from './navbar';
import Alert from './alertMessage';
export default{
    components: {
        Sidebar,
        Navbar,
        Alert,
    },
}
</script>
