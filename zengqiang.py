import os
import random
import shutil
# 数据增强的代码
def split_dataset(train_img_dir, train_lbl_dir, val_img_dir, val_lbl_dir, val_ratio=0.2):
    original_ids = []
    valid_exts = ('.jpg', '.jpeg', '.png')

    for f in os.listdir(train_img_dir):
        base_name = os.path.splitext(f)[0]
        if base_name.isdigit() and int(base_name) <= 136:
            original_ids.append(int(base_name))

    original_ids = list(set(original_ids))  # 去重
    original_ids.sort()

    num_val = int(len(original_ids) * val_ratio)
    val_seeds = random.sample(original_ids, num_val)

    for d in [val_img_dir, val_lbl_dir]:
        for f in os.listdir(d):
            os.remove(os.path.join(d, f))

    # 这里的逻辑是：如果图片名 ID % 136 == 原图ID % 136，就说明它们是一家人
    # 或者更简单的：1, 18, 35... 都是由 1 号变出来的（根据你之前的增强步长）
    # 但最稳妥的办法是遍历 train 里所有文件，看它们属于哪组

    all_train_imgs = [f for f in os.listdir(train_img_dir) if f.lower().endswith(valid_exts)]

    moved_count = 0
    for img_name in all_train_imgs:
        base_name = os.path.splitext(img_name)[0]
        img_id = int(base_name)

        # 确定这这张图属于哪个“原图种子”
        # 之前每张原图衍生了 7 张几何 + 4 张光度，总共 1+7+4=12 张一小组
        # 如果逻辑复杂，我们直接通过 img_id 与种子匹配
        # 简单判定：如果是 1-136，直接查种子；如果是派生图，计算它是从哪个 ID 变来的

        parent_id = img_id
        if img_id > 136:
            # 这里的计算逻辑取决于你之前生成时的 current_idx 累加规则
            # 只要 parent_id 在 val_seeds 里，就移动
            # 考虑到可能复杂，我们用一个更直接的逻辑：
            # 如果 img_id 在 val_seeds 列表里，或者是它的后续衍生品
            pass

        target_seed = -1
        if img_id <= 136:
            target_seed = img_id
        else:
            # 这是一个通用的偏移判定：
            # 几何增强 17张变136，步长是17
            # 光度增强 136张变680，步长是136
            if 137 <= img_id <= 680:
                target_seed = (img_id - 137) % 136 + 1
            elif 18 <= img_id <= 136:
                target_seed = (img_id - 18) % 17 + 1

        if target_seed in val_seeds:
            # 移动图片
            shutil.move(os.path.join(train_img_dir, img_name), os.path.join(val_img_dir, img_name))
            # 移动标签
            lbl_name = base_name + ".txt"
            if os.path.exists(os.path.join(train_lbl_dir, lbl_name)):
                shutil.move(os.path.join(train_lbl_dir, lbl_name), os.path.join(val_lbl_dir, lbl_name))
            moved_count += 1

if __name__ == "__main__":
    T_IMG = "images/train"
    T_LBL = "labels/train"
    V_IMG = "images/val"
    V_LBL = "labels/val"

    split_dataset(T_IMG, T_LBL, V_IMG, V_LBL, val_ratio=0.15)