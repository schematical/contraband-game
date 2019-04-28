import _ from 'underscore';

class NPCTask{
    static taskIdCounter = 0;
    constructor(data){

        _.extend(this, data);
        this.taskId = NPCTask.taskIdCounter++;

    }
    execute(){ }
    markCompleted() {
        this._completed = true;
        this.npc.currentTask = null;
        this.npc.removeTask(this);
    }

}
export default NPCTask;