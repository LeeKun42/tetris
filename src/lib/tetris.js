
/**
 * 俄罗斯方块类
 */
class Tetris{
    constructor(width, height, canvas) {
        this.width = width
        this.height = height
        this.score = 0
        //运行状态 0=>停止状态 1=>运行中 2=> 暂停
        this.status = 0
        this.layoutMap = []
        for (let i=0; i<this.height; i++){
            this.layoutMap[i] = 0
        }

        //画底布背景
        const scale = 50;
        canvas.width = this.width*scale + this.width-1;
        canvas.height = this.height*scale + this.height-1;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        this.ctx = ctx
    }

    /**
     * 开始游戏
     */
    start() {
        this.status = 1
        this.newBlock()
        this.run()
    }

    /**
     * 重新开始游戏
     */
    reStart() {
        clearInterval(this.intervalId)
        this.status = 0
        this.score = 0
        this.layoutMap = []
        for (let i=0; i<this.height; i++){
            this.layoutMap[i] = 0
        }
        this.block = null
        this.status = 1
        this.newBlock()
        this.run()
    }

    run() {
        this.intervalId = setInterval(this.down.bind(this), 800)
    }

    /**
     * 暂停游戏
     */
    suspend() {
        this.status = 2
        clearInterval(this.intervalId)
    }

    /**
     * 继续游戏
     */
    continue() {
        this.status = 1
        this.run()
    }

    draw(){
        //画底布
        for (let i=0; i<this.height; i++){
            let num = this.layoutMap[i]
            let binNumStr = num.toString(2).padStart(this.width, '0')
            for (let j=0; j<this.width; j++){
                let bgColor = "#000000";//定义画笔颜色
                let posX = j==0 ? 0 : (j * 51)
                let posY = i==0 ? 0 : (i * 51)
                this.ctx.fillStyle = bgColor;
                this.ctx.fillRect(posX, posY, 50, 50);
            }
        }

        //画现有砖块
        for (let i=0; i<this.height; i++){
            let num = this.layoutMap[i]
            let binNumStr = num.toString(2).padStart(this.width, '0')
            for (let j=0; j<this.width; j++){
                if (binNumStr[j]=='1'){
                    let bgColor = "#FF0000";//定义画笔颜色
                    let posX = j==0 ? 0 : (j * 51)
                    let posY = i==0 ? 0 : (i * 51)
                    this.ctx.fillStyle = bgColor;
                    this.ctx.fillRect(posX, posY, 50, 50);
                }

            }
        }

        //画当前降落砖块
        for (let i=0; i<this.height; i++){
            let num = this.block.blockMap[i]
            let binNumStr = num.toString(2).padStart(this.width, '0')
            for (let j=0; j<this.width; j++){
                if (binNumStr[j]=='1'){
                    let bgColor = "#FF0000";//定义画笔颜色
                    let posX = j==0 ? 0 : (j * 51)
                    let posY = i==0 ? 0 : (i * 51)
                    this.ctx.fillStyle = bgColor;
                    this.ctx.fillRect(posX, posY, 50, 50);
                }

            }
        }
    }

    /**
     * 创建一个新的方块
     */
    newBlock() {
        if (this.status!=1){
            return
        }
        const type = Math.floor(Math.random()*7)+1
        this.block = new Block(type, this.width, this.height);
        //画方块
        this.draw()

        //判断是否结束游戏
        for (let i=this.height-1; i>=0; i--){
            if ((this.block.blockMap[i] & this.layoutMap[i])>0){
                this.status = 0
                alert("Game Over!!!")
                return
            }
        }
    }

    /**
     * 下移
     */
    down() {
        if (this.status!=1){
            return
        }
        let success = this.block.down(this.layoutMap)
        if (!success){
            //触底后合并底布和当前砖块
            for (let i=0; i<this.height; i++){
                this.layoutMap[i] = this.layoutMap[i] | this.block.blockMap[i]
            }
            //判断是否消除行
            const fullNum = parseInt("1".padStart(this.width,"1"), 2)
            for (let i=0; i<this.height; i++){
                if (fullNum == this.layoutMap[i]){//可以消除
                    this.layoutMap.splice(i,1)
                    this.layoutMap.unshift(0)
                    this.score++
                }
            }

            this.newBlock()
        }
        this.draw()
    }

    /**
     * 左移
     */
    left() {
        if (this.status!=1){
            return
        }
        this.block.left(this.layoutMap)
        this.draw()
    }

    /**
     * 右移
     */
    right() {
        if (this.status!=1){
            return
        }
        this.block.right(this.layoutMap)
        this.draw()
    }

    /**
     * 旋转
     */
    rotate() {
        if (this.status!=1){
            return
        }
        this.block.rotate(this.layoutMap)
        this.draw()
    }
}

/**
 * 方块类
 */
class Block{
    constructor(type, width, height) {
        this.rotateNum = 1
        this.type = type
        this.width = width
        this.height = height
        this.blockMap = []
        for (let i=0; i<this.height; i++){
            this.blockMap[i] = 0
        }
        const midPos = this.width / 2
        const buff = new ArrayBuffer(this.width)
        const uint8 = new Uint8Array(buff)
        switch (type) {
            case 1: //正方形方块
                uint8[midPos-1] = 1
                uint8[midPos] = 1
                this.blockMap[0] = parseInt(uint8.join(""), 2)
                this.blockMap[1] = parseInt(uint8.join(""), 2)
                break
            case 2: //I形方块
                uint8[midPos-1] = 1
                this.blockMap[0] = parseInt(uint8.join(""), 2)
                this.blockMap[1] = parseInt(uint8.join(""), 2)
                this.blockMap[2] = parseInt(uint8.join(""), 2)
                this.blockMap[3] = parseInt(uint8.join(""), 2)
                this.centerPosIndex = 2
                break
            case 3: //S形方块
                uint8[midPos-1] = 1
                uint8[midPos] = 1
                this.blockMap[0] = parseInt(uint8.join(""), 2)
                uint8[midPos] = 0
                uint8[midPos-2] = 1
                this.blockMap[1] = parseInt(uint8.join(""), 2)
                this.direction = 'up'
                break
            case 4: //Z形方块
                uint8[midPos-1] = 1
                uint8[midPos-2] = 1
                this.blockMap[0] = parseInt(uint8.join(""), 2)
                uint8[midPos] = 1
                uint8[midPos-2] = 0
                this.blockMap[1] = parseInt(uint8.join(""), 2)
                break
            case 5: //L形方块
                uint8[midPos-1] = 1
                this.blockMap[0] = parseInt(uint8.join(""), 2)
                this.blockMap[1] = parseInt(uint8.join(""), 2)
                uint8[midPos] = 1
                this.blockMap[2] = parseInt(uint8.join(""), 2)
                break
            case 6: //J形方块
                uint8[midPos] = 1
                this.blockMap[0] = parseInt(uint8.join(""), 2)
                this.blockMap[1] = parseInt(uint8.join(""), 2)
                uint8[midPos-1] = 1
                this.blockMap[2] = parseInt(uint8.join(""), 2)
                break
            case 7: //T形方块
                uint8[midPos-2] = 1
                uint8[midPos-1] = 1
                uint8[midPos] = 1
                this.blockMap[0] = parseInt(uint8.join(""), 2)
                uint8[midPos-2] = 0
                uint8[midPos] = 0
                this.blockMap[1] = parseInt(uint8.join(""), 2)
                break
        }
    }

    /**
     * 下移
     */
    down(layoutMap) {
        //触底检查
        if (this.blockMap[this.height-1]>0){
            return false
        }
        //碰撞检查
        for (let i=this.height-1; i>=0; i--){
            if (this.blockMap[i]>0){
                if ((this.blockMap[i] & layoutMap[i+1])>0){
                    return false
                }
            }
        }

        for (let i=this.height-1; i>=0; i--){
            this.blockMap[i] = this.blockMap[i-1]
            this.blockMap[i-1] = 0
            if (i==0){
                this.blockMap[i] = 0
            }
        }
        return true
    }

    /**
     * 左移
     */
    left(layoutMap) {
        const leftCompNum = parseInt("1".padEnd(this.width, "0"), 2)
        //触边检查
        for (let i=0; i<this.height; i++){
            if (this.blockMap[i]>0){
                if ((this.blockMap[i] & leftCompNum)>0){
                    return
                }
            }
        }

        //碰撞检查
        for (let i=this.height-1; i>=0; i--){
            if (this.blockMap[i]>0){
                let after = this.blockMap[i] << 1
                if ((after & layoutMap[i])>0){
                    return
                }
            }
        }

        for (let i=0; i<this.height; i++){
            if (this.blockMap[i]>0){
                this.blockMap[i] = this.blockMap[i] << 1
            }
        }
    }

    /**
     * 右移
     */
    right(layoutMap) {
        const rightCompNum = 1
        for (let i=0; i<this.height; i++){
            if (this.blockMap[i]>0){
                if ((this.blockMap[i] & rightCompNum)==1){
                    return
                }
            }
        }

        //碰撞检查
        for (let i=this.height-1; i>=0; i--){
            if (this.blockMap[i]>0){
                let after = this.blockMap[i] >> 1
                if ((after & layoutMap[i])>0){
                    return
                }
            }
        }

        for (let i=0; i<this.height; i++){
            if (this.blockMap[i]>0){
                this.blockMap[i] = this.blockMap[i] >> 1
            }
        }
    }

    /**
     * 顺时针旋转
     */
    rotate(layoutMap) {
        // 旋转后大方块的坐标点集合  二进制
        let newMap = []
        // 旋转容器表格方块数
        let gridLen = 3
        // 该类型的大方块第几个小方块为旋转中心点
        let centerPosIndex = 0
        // 每次中心点不一样，根据旋转次数/角度，获取中心点
        let centerPosIndexMap = [0,0,0,0]
        // 根据中心点获取旋转容的起始坐标
        let xLen = 0
        let yLen = 0
        //容器中心点距离容器边线的格子数
        let gridMarginX = 1
        let gridMarginY = 1

        //第几个小方块
        let seq = 0

        switch (this.type) {
            case 1: //正方形方块
                //无需旋转
                return
            case 2: //I形方块
                centerPosIndexMap = [2,3,3,2]
                gridLen = 4
                const iGridMarginMap = [
                    {x:1, y:1},
                    {x:2, y:1},
                    {x:2, y:2},
                    {x:1, y:2},
                ]
                gridMarginX = iGridMarginMap[this.rotateNum-1].x
                gridMarginY = iGridMarginMap[this.rotateNum-1].y
                break
            case 3: //S形方块
                centerPosIndexMap = [4,2,1,3]
                break
            case 4: //Z形方块
                centerPosIndexMap = [3,2,2,3]
                break
            case 5: //L形方块
                centerPosIndexMap = [2,2,3,3]
                break
            case 6: //J形方块
                centerPosIndexMap = [2,3,3,2]
                break
            case 7: //T形方块
                centerPosIndexMap = [4,2,1,3]
                break
        }
        //根据旋转次数获取中心点方块索引
        centerPosIndex = centerPosIndexMap[this.rotateNum-1]

        //根据中心点方块获取旋转容器起始坐标

        for (let i=0; i<this.height; i++){
            let num = this.blockMap[i]
            let binNumStr = num.toString(2).padStart(this.width, '0')
            for (let j=0; j<this.width; j++){
                if (binNumStr[j]=='1'){
                    seq++
                    if (seq==centerPosIndex){//中心点
                        xLen = j - gridMarginX //中心点距离左边的格数
                        yLen = i - gridMarginY //中心点距离上边的格数
                        //触左边旋转情况
                        if (xLen<0) {
                            xLen = 0
                        }
                        //触右边旋转情况
                        if (xLen>(this.width-gridLen+1)) {
                            xLen = this.width-gridLen+1
                        }
                        break
                    }
                }
            }
        }

        //旋转
        for (let i=0; i<this.height; i++){
            let num = this.blockMap[i]
            let binNumStr = num.toString(2).padStart(this.width, '0')
            for (let j=0; j<this.width; j++){
                if (binNumStr[j]=='1'){//调整位置
                    const newY = j - xLen
                    const newX = gridLen-1-(i - yLen)
                    newMap.push({x:newX, y:newY})
                }
            }
        }
        //重新设置方块数据
        for (let i=0; i<this.height; i++){
            let numStr = "0".padStart(this.width, '0')
            for (let pos of newMap){
                if (pos.y+yLen==i){//调整位置
                    numStr = numStr.substring(0, pos.x+xLen) + "1" + numStr.substring(pos.x+xLen + 1);
                }
            }
            this.blockMap[i] = parseInt(numStr, 2)
        }

        //增加旋转次数
        if (this.rotateNum==4){
            this.rotateNum = 1
        }else{
            this.rotateNum++
        }
    }
}

export default Tetris