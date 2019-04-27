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
        this.npc.tasks = _.reject(this.npc.tasks, (_task) => {
            return this.taskId == _task.taskId;
        })
    }

}
export default NPCTask;