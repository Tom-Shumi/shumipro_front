import React, { Dispatch, SetStateAction, useState, useEffect} from 'react';
import DailyTaskList from './DailyTaskList';
import { DndProvider } from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import { DailyTask } from '../common/interface';
import {getApiClient} from '../util/AuthenticationUtil';
import Router from 'next/router';
import * as NumberUtil from '../util/NumberUtil';

interface DailyTaskBoardProps {
    initDispFlg: Boolean;
    includeDeleteFlg: number;
    setInitDispFlg: Dispatch<SetStateAction<Boolean>>;
    setTotalTaskCount: Dispatch<SetStateAction<number>>;
    setDoneTaskCount: Dispatch<SetStateAction<number>>;
    setTotalDoneTime: Dispatch<SetStateAction<string>>;
    showDailyTaskEditModal: (DailyTask) => void;
}

const DailyTaskBoard: React.FC<DailyTaskBoardProps> = (props) => {
    // デイリータスク
    const [dailyTaskList, setDailyTaskList] = useState<DailyTask[]>([]);

    useEffect(() => {
        props.setInitDispFlg(false);
        callGetDailyTaskList();
    }, [props.initDispFlg, props.includeDeleteFlg]);

    const callGetDailyTaskList = () => {
        var res: Promise<DailyTask[]> = getDailyTaskList(props.includeDeleteFlg);
        res.then(ret => {
            setDailyTaskList(ret);
            let doneTaskCount = 0;
            let totalDoneTime = 0;
            let deleteTaskCount = 0;
            for (var i = 0 ; i < ret.length ; i++) {
                if (ret[i].deleteFlg == 1) {
                    deleteTaskCount++;
                    continue;
                }
                if (ret[i].quota <= ret[i].doneTime) {
                    doneTaskCount++;
                }
                totalDoneTime += ret[i].doneTime
            }
            props.setTotalTaskCount(ret.length - deleteTaskCount);
            props.setDoneTaskCount(doneTaskCount);
            props.setTotalDoneTime(NumberUtil.convertHourMinute(totalDoneTime));
        });
    }

    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <DailyTaskList
                    key="DailyTaskList"
                    dailyTaskList={dailyTaskList}
                    setInitDispFlg={props.setInitDispFlg}
                    showDailyTaskEditModal={props.showDailyTaskEditModal}
                />
            </DndProvider>
        </div>
    )
}

async function getDailyTaskList(includeDeleteFlg: number){

    var dailyTaskList : DailyTask[] = [];

    try {
        const res = await getApiClient().get(process.env.NEXT_PUBLIC_API_DAILY_TASK, {
            params: {
                includeDeleteFlg: includeDeleteFlg
            }
        });
        dailyTaskList = createDailyTaskList(res.data);
    } catch(error){
        Router.push('/Error?400');
    }
    return dailyTaskList;
}

function createDailyTaskList(responseData: any[]): DailyTask[]{
    let length: number = responseData.length;
    var dailyTaskList :DailyTask[] = [];

    for (var i = 0 ; i < length ; i++) {

        let dailyTask = new DailyTask(responseData[i]["id"], responseData[i]["username"],
        responseData[i]["title"], responseData[i]["description"], responseData[i]["priority"],
        responseData[i]["quota"], responseData[i]["deleteFlg"], responseData[i]["createDate"],
        responseData[i]["deleteDate"], responseData[i]["doneDate"], responseData[i]["doneTime"], responseData[i]["dispOrder"]);

        dailyTaskList.push(dailyTask);
    }

    console.log(responseData)
    return dailyTaskList;
}

export default DailyTaskBoard;
