<template>
    <div id="footer">
        <span id="version">VER - 0.1.0</span>
    </div>
</template>
<style scoped>
#footer{
    position: absolute;
    top:calc( 100% - 20px );
    width: 100%;
    height: 20px;
    z-index: 10;
}
#version{
    font-family: "Bender";
    font-size: 16px;
    color: white;
    position: absolute;
    top: -12px;
    right: 10px
}
</style>