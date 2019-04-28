class NPCDialogManager{
    constructor(data){

        this.events = {};
        Object.keys(data).forEach((namespace)=>{
            let dialog = data[namespace];
            this.events[dialog.event] = this.events[dialog.event] || [];
            this.events[dialog.event].push(dialog);
        })
    }
    getEventChat(eventType, npcType){
        let dialogColl = this.events[eventType];
        if(!dialogColl){
            throw new Error("No valid `dialog` for `event`: " + eventType);
        }
        let index = Math.floor(Math.random() * dialogColl.length);
        return dialogColl[index];
    }

}
export default NPCDialogManager;


