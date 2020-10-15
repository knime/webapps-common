<script>
import PortIcon2 from './PortIcon2';

export default {
    components: {
        PortIcon2
    },
    props: {
        color: {
            type: String,
            default: ''
        },
        optional: {
            type: Boolean,
            default: false
        },
        dataType: {
            type: String,
            default: 'Data'
        },        
    }
};
</script>

<template>
    <PortIcon2 
        :color="color"
        :filled="!optional"
        :dataType="dataType"
    />
</template>
