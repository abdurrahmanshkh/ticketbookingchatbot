<script>
	import { 
        Card,
        Button,
        Input,
        Label,
        Hr,
    } from "flowbite-svelte";

    let username = "Sajid Patel";
    let password = "";
    let key="1234"
    var login = false;
    var error = "";

    function handleSubmit(event) {
        event.preventDefault();
        if(password==key){
            login = true;
            error = "";
            window.location.href = "/data";
        }else{
            error = "Incorrect Password";
        }
    }
    
</script>

<div class="py-10 md:px-72">
    <h1 class="text-3xl font-semibold text-gray-900 dark:text-white text-center pb-10">
        Welcome to Voter's Data Portal
    </h1>
    <Card class="max-w-full">
        <form class="flex flex-col space-y-6" action="/">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                Login to Access Data
            </h3>
            
            <Hr classHr="my-8" />
            <Label class="space-y-2">
                <span>Full Name</span>
                <Input type="text" name="name" placeholder="John" bind:value={username} required />
            </Label>
            
            <Label class="space-y-2">
                <span>Your password</span>
                <Input type="password" name="password" placeholder="•••••" bind:value={password} required />
            </Label>
            {#if error.length>0}
                <p class="text-red-500">{error}</p>
            {/if}
            <Label>
                <Button on:click={handleSubmit} class="w-48">
                    Login
                </Button>
            </Label>
        </form>
    </Card>
</div>
